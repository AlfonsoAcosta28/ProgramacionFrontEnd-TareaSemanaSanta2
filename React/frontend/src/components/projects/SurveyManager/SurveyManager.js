import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const SurveyManager = () => {
    const [surveys, setSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user, token } = useContext(AuthContext);

    const fetchSurveys = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/surveys');
            setSurveys(response.data);
        } catch (err) {
            setError('Error al cargar las encuestas');
        }
    };

    const handleSubmitResponse = async (surveyId, answer) => {
        try {
            await axios.post(`http://localhost:5000/api/surveys/${surveyId}/respond`,
                { answer },
                { headers: { 'x-auth-token': token } }
            );
            setSuccess('¡Gracias por tu respuesta!');
            fetchResults(surveyId);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar la respuesta');
        }
    };

    const fetchResults = async (surveyId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/surveys/${surveyId}/results`);
            setResults(response.data);
        } catch (err) {
            setError('Error al cargar los resultados');
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    const renderChart = (results) => {
        const data = {
            labels: Object.keys(results.results),
            datasets: [
                {
                    data: Object.values(results.results),
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }
            ]
        };

        return <Pie data={data} />;
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Encuestas</h2>
            <div className="my-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow">
                    <Link to="/survey/new" className="text-white no-underline">
                        Nueva Encuesta
                    </Link>
                </Button>
            </div>


            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

            <Row>
                {surveys.map(survey => (
                    <Col md={6} key={survey.id} className="mb-4">
                        <Card>
                            <Card.Header as="h5">{survey.question}</Card.Header>
                            <Card.Body>
                                <Form>
                                    {survey.options.map((option, index) => (
                                        <Form.Check
                                            key={index}
                                            type="radio"
                                            name={`survey-${survey.id}`}
                                            label={option}
                                            onChange={() => handleSubmitResponse(survey.id, option)}
                                        />
                                    ))}
                                </Form>
                                <Button
                                    variant="outline-primary"
                                    className="mt-3"
                                    onClick={() => {
                                        setSelectedSurvey(survey);
                                        fetchResults(survey.id);
                                    }}
                                >
                                    Ver Resultados
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {results && (
                <Card className="mt-4">
                    <Card.Header as="h5">Resultados: {results.survey.question}</Card.Header>
                    <Card.Body>
                        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                            {renderChart(results)}
                        </div>
                        <p className="text-center mt-3">
                            Total de respuestas: {results.totalResponses}
                        </p>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default SurveyManager;