const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener tasa de cambio
router.get('/convert', async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    
    // Llamada a la API externa (ejemplo con ExchangeRate-API)
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${from}/${to}/${amount}`
    );
    
    res.json({
      from,
      to,
      amount: parseFloat(amount),
      result: response.data.conversion_result,
      rate: response.data.conversion_rate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al convertir la moneda' });
  }
});

// Obtener lista de monedas disponibles
router.get('/currencies', async (req, res) => {
  try {
    // Llamada a la API externa para obtener las monedas disponibles
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/codes`
    );
    
    res.json(response.data.supported_codes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las monedas' });
  }
});

module.exports = router;