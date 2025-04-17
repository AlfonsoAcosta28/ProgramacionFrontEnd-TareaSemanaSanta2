import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Button, Form, Modal, Badge, Alert } from 'react-bootstrap';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({ title: '', description: '', completed: false });
  const [isEditing, setIsEditing] = useState(false);

  // Obtener tareas al cargar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks');
        setTasks(res.data);
      } catch (err) {
        setError('Error al cargar las tareas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentTask({
      ...currentTask,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Abrir modal para crear tarea
  const openCreateModal = () => {
    setCurrentTask({ title: '', description: '', completed: false });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar tarea
  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Crear o actualizar tarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let res;
      
      if (isEditing) {
        // Actualizar tarea
        res = await axios.put(`http://localhost:5000/api/tasks/${currentTask.id}`, currentTask);
        setTasks(tasks.map(task => task.id === currentTask.id ? res.data : task));
      } else {
        // Crear tarea
        res = await axios.post('http://localhost:5000/api/tasks', currentTask);
        setTasks([res.data, ...tasks]);
      }
      
      closeModal();
    } catch (err) {
      setError(isEditing ? 'Error al actualizar la tarea' : 'Error al crear la tarea');
      console.error(err);
    }
  };

  // Cambiar estado de tarea (completado/pendiente)
  const toggleCompleted = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const res = await axios.put(`http://localhost:5000/api/tasks/${task.id}`, updatedTask);
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
    } catch (err) {
      setError('Error al actualizar el estado de la tarea');
      console.error(err);
    }
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (err) {
        setError('Error al eliminar la tarea');
        console.error(err);
      }
    }
  };

  if (loading) return <Container className="mt-5"><p>Cargando tareas...</p></Container>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Gestor de Tareas</h2>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <Button variant="primary" onClick={openCreateModal}>
            Nueva Tarea
          </Button>
        </Col>
      </Row>
      
      <ListGroup>
        {tasks.length === 0 ? (
          <p>No hay tareas disponibles. ¡Crea una!</p>
        ) : (
          tasks.map(task => (
            <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Form.Check 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleCompleted(task)}
                  className="me-3"
                />
                <div>
                  <h5 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                    {' '}
                    <Badge bg={task.completed ? 'success' : 'warning'}>
                      {task.completed ? 'Completada' : 'Pendiente'}
                    </Badge>
                  </h5>
                  <p className="mb-0">{task.description}</p>
                </div>
              </div>
              <div>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEditModal(task)}>
                  Editar
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => deleteTask(task.id)}>
                  Eliminar
                </Button>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
      
      {/* Modal para crear/editar tarea */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentTask.title}
                onChange={handleChange}
                placeholder="Título de la tarea"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={currentTask.description}
                onChange={handleChange}
                placeholder="Descripción de la tarea"
              />
            </Form.Group>
            {isEditing && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Completada"
                  name="completed"
                  checked={currentTask.completed}
                  onChange={handleChange}
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default TaskList;