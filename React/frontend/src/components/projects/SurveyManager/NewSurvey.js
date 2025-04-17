import React, { useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';

const CreateSurvey = ({ onSurveyCreated }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validOptions = options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        setError('Debes proporcionar al menos 2 opciones');
        return;
      }

      await axios.post('http://localhost:5000/api/surveys',
        { question, options: validOptions },
        { headers: { 'x-auth-token': token } }
      );

      setQuestion('');
      setOptions(['', '']);
      onSurveyCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la encuesta');
    }
  };

  return (
    <Container className="mt-5">
      <Card className="mb-4">
        <Card.Header as="h5">Crear Nueva Encuesta</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Pregunta</Form.Label>
              <Form.Control
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </Form.Group>

            {options.map((option, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>Opción {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </Form.Group>
            ))}

            <Button variant="secondary" type="button" onClick={handleAddOption} className="me-2">
              Agregar Opción
            </Button>
            <Button variant="primary" type="submit">
              Crear Encuesta
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>


  );
};

export default CreateSurvey;