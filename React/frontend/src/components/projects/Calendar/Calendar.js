import React, { useState, useEffect, useContext } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import { Container, Modal, Button, Form, Alert } from 'react-bootstrap';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start: new Date(),
    end: new Date(),
  });
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { 'x-auth-token': token }
      });
      setEvents(response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
    } catch (err) {
      setError('Error al cargar los eventos');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setEventForm({
      title: '',
      description: '',
      start,
      end
    });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventForm(event);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        await axios.put(
          `http://localhost:5000/api/events/${selectedEvent.id}`,
          eventForm,
          { headers: { 'x-auth-token': token } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/events',
          eventForm,
          { headers: { 'x-auth-token': token } }
        );
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      setError('Error al guardar el evento');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/events/${selectedEvent.id}`,
        { headers: { 'x-auth-token': token } }
      );
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      setError('Error al eliminar el evento');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Calendario de Eventos</h2>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      <div style={{ height: '500px' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "No hay eventos en este rango"
          }}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent ? 'Editar Evento' : 'Nuevo Evento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={eventForm.title}
                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha y hora de inicio</Form.Label>
              <Form.Control
                type="datetime-local"
                value={format(eventForm.start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setEventForm({...eventForm, start: new Date(e.target.value)})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha y hora de fin</Form.Label>
              <Form.Control
                type="datetime-local"
                value={format(eventForm.end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setEventForm({...eventForm, end: new Date(e.target.value)})}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="primary" type="submit">
                {selectedEvent ? 'Actualizar' : 'Crear'}
              </Button>
              {selectedEvent && (
                <Button variant="danger" onClick={handleDelete}>
                  Eliminar
                </Button>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Calendar;