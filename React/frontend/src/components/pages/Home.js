import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  const projects = [
    {
      title: 'Gestor de Tareas',
      description: 'Organiza tus tareas diarias, añade, edita y marca como completadas.',
      path: '/tasks',
      icon: '📝'
    },
    {
      title: 'Conversor de Monedas',
      description: 'Convierte entre diferentes divisas con tasas de cambio en tiempo real.',
      path: '/currency',
      icon: '💱'
    },
    {
      title: 'Generador de Contraseñas',
      description: 'Crea contraseñas seguras con diferentes niveles de complejidad.',
      path: '/password',
      icon: '🔒'
    },
    {
      title: 'Encuestas',
      description: 'Responde encuestas y visualiza los resultados en gráficos.',
      path: '/surveys',
      icon: '📊'
    },
    {
      title: 'Agenda de Eventos',
      description: 'Organiza tus eventos en un calendario interactivo.',
      path: '/calendar',
      icon: '📅'
    }
  ];

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Proyecto Integrado React</h1>
          {!user && (
            <p className="text-center">
              <Link to="/login">Inicia sesión</Link> o <Link to="/register">regístrate</Link> para acceder a todas las funcionalidades.
            </p>
          )}
        </Col>
      </Row>
      <Row>
        {projects.map((project, index) => (
          <Col md={4} className="mb-4" key={index}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title className="text-center mb-3">
                  <span style={{ fontSize: '2rem' }}>{project.icon}</span> {project.title}
                </Card.Title>
                <Card.Text>{project.description}</Card.Text>
              </Card.Body>
              <Card.Footer className="text-center">
                {user ? (
                  <Link to={project.path} className="btn btn-primary">
                    Ir al proyecto
                  </Link>
                ) : (
                  <span className="text-muted">Inicia sesión para acceder</span>
                )}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;