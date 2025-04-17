import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Container, Form, Row, Col, Button, Card, Alert, Spinner } from 'react-bootstrap';

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/currency/currencies');
        setCurrencies(res.data);
      } catch (err) {
        setError('Error al cargar las monedas disponibles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConverting(true);
    setError('');
    
    try {
      const res = await axios.get('http://localhost:5000/api/currency/convert', {
        params: { from: fromCurrency, to: toCurrency, amount }
      });
      setResult(res.data);
    } catch (err) {
      setError('Error al convertir las monedas');
      setResult(null);
      console.error(err);
    } finally {
      setConverting(false);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Convertir las monedas al formato que espera react-select
  const currencyOptions = currencies.map(([code, name]) => ({
    value: code,
    label: `${code} - ${name}`
  }));

  // Encontrar la opción seleccionada actual
  const selectedFromCurrency = currencyOptions.find(option => option.value === fromCurrency);
  const selectedToCurrency = currencyOptions.find(option => option.value === toCurrency);

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '38px',
      border: '1px solid #ced4da',
      borderRadius: '0.375rem',
      '&:hover': {
        borderColor: '#86b7fe'
      }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    })
  };

  if (loading) return <Container className="mt-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Conversor de Monedas</h2>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Group>
                  <Form.Label>De:</Form.Label>
                  <Select
                    styles={customStyles}
                    value={selectedFromCurrency}
                    onChange={(option) => setFromCurrency(option.value)}
                    options={currencyOptions}
                    isSearchable={true}
                    placeholder="Buscar moneda..."
                    noOptionsMessage={() => "No se encontraron monedas"}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-center justify-content-center">
                <Button variant="outline-secondary" onClick={handleSwap} className="mt-3">
                  ⇄
                </Button>
              </Col>
              <Col md={5}>
                <Form.Group>
                  <Form.Label>A:</Form.Label>
                  <Select
                    styles={customStyles}
                    value={selectedToCurrency}
                    onChange={(option) => setToCurrency(option.value)}
                    options={currencyOptions}
                    isSearchable={true}
                    placeholder="Buscar moneda..."
                    noOptionsMessage={() => "No se encontraron monedas"}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Cantidad:</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <Button variant="primary" type="submit" disabled={converting}>
                  {converting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Convirtiendo...
                    </>
                  ) : (
                    'Convertir'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>

          {result && (
            <Card className="mt-4 text-center">
              <Card.Body>
                <h3>Resultado</h3>
                <h4>
                  {result.amount} {result.from} = {result.result.toFixed(2)} {result.to}
                </h4>
                <p className="mb-0">
                  1 {result.from} = {result.rate.toFixed(6)} {result.to}
                </p>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CurrencyConverter;