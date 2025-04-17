import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Form, Row, Col, Button, Card, ListGroup, Alert } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';

const PasswordGenerator = () => {
  const [passwordOptions, setPasswordOptions] = useState({
    length: 12,
    hasSpecialChars: true,
    hasNumbers: true,
    hasUppercase: true
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchSavedPasswords();
    }
  }, [user]);

  const fetchSavedPasswords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/passwords');
      setSavedPasswords(res.data);
    } catch (err) {
      setError('Error al cargar las contraseñas guardadas');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPasswordOptions({
      ...passwordOptions,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const generatePassword = async () => {
    setError('');
    setSuccess('');
    
    try {
      const res = await axios.get('http://localhost:5000/api/passwords/generate', {
        params: passwordOptions
      });
      setGeneratedPassword(res.data.password);
    } catch (err) {
      setError('Error al generar la contraseña');
      console.error(err);
    }
  };

  const savePassword = async () => {
    if (!generatedPassword) return;
    
    try {
      await axios.post('http://localhost:5000/api/passwords/save', {
        password: generatedPassword,
        ...passwordOptions
      });
      setSuccess('Contraseña guardada exitosamente');
      fetchSavedPasswords();
    } catch (err) {
      setError('Error al guardar la contraseña');
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword)
      .then(() => setSuccess('Contraseña copiada al portapapeles'))
      .catch(() => setError('Error al copiar al portapapeles'));
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Generador de Contraseñas</h2>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header as="h5">Opciones</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Longitud: {passwordOptions.length}</Form.Label>
                  <Form.Range
                    name="length"
                    min="4"
                    max="32"
                    value={passwordOptions.length}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="hasUppercase"
                    label="Incluir mayúsculas (A-Z)"
                    checked={passwordOptions.hasUppercase}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="hasNumbers"
                    label="Incluir números (0-9)"
                    checked={passwordOptions.hasNumbers}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="hasSpecialChars"
                    label="Incluir caracteres especiales (!@#$%^&*)"
                    checked={passwordOptions.hasSpecialChars}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" onClick={generatePassword}>
                  Generar Contraseña
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          {generatedPassword && (
            <Card>
              <Card.Header as="h5">Contraseña Generada</Card.Header>
              <Card.Body>
                <Card.Text className="password-display p-3 bg-light border rounded">
                  <span className="fs-5 fw-bold">{generatedPassword}</span>
                </Card.Text>
                <div className="mt-3 d-flex gap-2">
                  <Button variant="outline-primary" onClick={copyToClipboard}>
                    Copiar
                  </Button>
                  {user && (
                    <Button variant="outline-success" onClick={savePassword}>
                      Guardar
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
        
        {user && (
          <Col md={6}>
            <Card>
              <Card.Header as="h5">Contraseñas Guardadas</Card.Header>
              <ListGroup variant="flush">
                {savedPasswords.length === 0 ? (
                  <ListGroup.Item>No hay contraseñas guardadas</ListGroup.Item>
                ) : (
                  savedPasswords.map(pwd => (
                    <ListGroup.Item key={pwd.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{pwd.password}</div>
                        <small className="text-muted">
                          Longitud: {pwd.length} | 
                          {pwd.hasSpecialChars ? ' Caracteres especiales' : ''} |
                          {pwd.hasNumbers ? ' Números' : ''} |
                          {pwd.hasUppercase ? ' Mayúsculas' : ''}
                        </small>
                      </div>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(pwd.password)}
                      >
                        Copiar
                      </Button>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card>
          </Col>
        )}
      </Row>

      <style jsx>{`
        .password-display {
          word-break: break-all;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Container>
  );
};

export default PasswordGenerator;
