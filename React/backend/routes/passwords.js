const express = require('express');
const router = express.Router();
const { Password } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Generar una contraseña aleatoria
router.get('/generate', async (req, res) => {
  try {
    const { length = 12, hasSpecialChars = true, hasNumbers = true, hasUppercase = true } = req.query;
    
    // Definir caracteres posibles
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (hasUppercase === 'true') chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (hasNumbers === 'true') chars += '0123456789';
    if (hasSpecialChars === 'true') chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Generar contraseña
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    
    res.json({ password });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Guardar una contraseña generada
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { password, length, hasSpecialChars, hasNumbers } = req.body;
    
    const savedPassword = await Password.create({
      password,
      length: parseInt(length),
      hasSpecialChars: hasSpecialChars === 'true',
      hasNumbers: hasNumbers === 'true',
      userId: req.user.id
    });
    
    res.status(201).json(savedPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener contraseñas guardadas
router.get('/', authMiddleware, async (req, res) => {
  try {
    const passwords = await Password.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(passwords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;