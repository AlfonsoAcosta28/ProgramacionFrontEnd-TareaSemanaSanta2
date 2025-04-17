import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const MainNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Proyecto Integrado</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && (
              <>
                <Nav.Link as={Link} to="/tasks">Gestor de Tareas</Nav.Link>
                <Nav.Link as={Link} to="/currency">Conversor de Monedas</Nav.Link>
                <Nav.Link as={Link} to="/password">Generador de Contraseñas</Nav.Link>
                <Nav.Link as={Link} to="/surveys">Encuestas</Nav.Link>
                <Nav.Link as={Link} to="/calendar">Agenda de Eventos</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link className="text-light">¡Hola, {user.username}!</Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>Cerrar Sesión</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;