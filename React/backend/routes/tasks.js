const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener todas las tareas del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear una nueva tarea
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({
      title,
      description,
      userId: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Actualizar una tarea
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    await task.update({ title, description, completed });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Eliminar una tarea
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    
    await task.destroy();
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;