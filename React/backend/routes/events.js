const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener todos los eventos del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { userId: req.user.id },
      order: [['start', 'ASC']]
    });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear un nuevo evento
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, start, end } = req.body;
    const event = await Event.create({
      title,
      description,
      start,
      end,
      userId: req.user.id
    });
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar un evento
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, start, end } = req.body;
    const event = await Event.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    
    await event.update({ title, description, start, end });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar un evento
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    
    await event.destroy();
    res.json({ message: 'Evento eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;