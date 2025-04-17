// Conversión de temperatura
exports.convertTemperature = (req, res) => {
    const { value, from, to } = req.body;
    
    if (!value || !from || !to) {
      return res.status(400).json({ message: 'Faltan parámetros' });
    }
    
    let result;
    const numValue = parseFloat(value);
    
    if (from === 'celsius' && to === 'fahrenheit') {
      result = (numValue * 9/5) + 32;
    } else if (from === 'fahrenheit' && to === 'celsius') {
      result = (numValue - 32) * 5/9;
    } else if (from === 'celsius' && to === 'kelvin') {
      result = numValue + 273.15;
    } else if (from === 'kelvin' && to === 'celsius') {
      result = numValue - 273.15;
    } else if (from === 'fahrenheit' && to === 'kelvin') {
      result = (numValue - 32) * 5/9 + 273.15;
    } else if (from === 'kelvin' && to === 'fahrenheit') {
      result = (numValue - 273.15) * 9/5 + 32;
    } else {
      result = numValue; // Misma unidad
    }
    
    res.json({ result: parseFloat(result.toFixed(2)) });
  };
  
  // Conversión de longitud
  exports.convertLength = (req, res) => {
    const { value, from, to } = req.body;
    
    if (!value || !from || !to) {
      return res.status(400).json({ message: 'Faltan parámetros' });
    }
    
    const conversionRates = {
      metros: 1,
      kilometros: 0.001,
      centimetros: 100,
      milimetros: 1000,
      pulgadas: 39.3701,
      pies: 3.28084,
      millas: 0.000621371
    };
    
    // Convertir a metros primero
    const valueInMeters = parseFloat(value) / conversionRates[from];
    // Luego convertir a la unidad destino
    const result = valueInMeters * conversionRates[to];
    
    res.json({ result: parseFloat(result.toFixed(4)) });
  };
  
  // Conversión de peso
  exports.convertWeight = (req, res) => {
    const { value, from, to } = req.body;
    
    if (!value || !from || !to) {
      return res.status(400).json({ message: 'Faltan parámetros' });
    }
    
    const conversionRates = {
      gramos: 1,
      kilogramos: 0.001,
      miligramos: 1000,
      libras: 0.00220462,
      onzas: 0.035274
    };
    
    // Convertir a gramos primero
    const valueInGrams = parseFloat(value) / conversionRates[from];
    // Luego convertir a la unidad destino
    const result = valueInGrams * conversionRates[to];
    
    res.json({ result: parseFloat(result.toFixed(4)) });
  };