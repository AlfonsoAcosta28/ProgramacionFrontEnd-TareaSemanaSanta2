const Event = require('../models/Event');

// Obtener todos los eventos
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo evento
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un evento
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    await event.update(req.body);
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un evento
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    await event.destroy();
    res.json({ message: 'Evento eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};