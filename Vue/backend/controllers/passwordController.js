const Password = require('../models/Password');

// Generar una contraseña
exports.generatePassword = async (req, res) => {
  const { length = 12, hasUppercase = true, hasLowercase = true, hasNumbers = true, hasSymbols = true } = req.body;
  
  try {
    let characters = '';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|\'",./<>?';
    
    if (hasUppercase) characters += uppercaseChars;
    if (hasLowercase) characters += lowercaseChars;
    if (hasNumbers) characters += numberChars;
    if (hasSymbols) characters += symbolChars;
    
    if (characters === '') {
      return res.status(400).json({ message: 'Debes seleccionar al menos un tipo de carácter' });
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Guardar la contraseña generada en la base de datos
    const savedPassword = await Password.create({
      value: password,
      length,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols
    });
    
    res.json({ password, id: savedPassword.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener historial de contraseñas generadas
exports.getPasswordHistory = async (req, res) => {
  try {
    const passwords = await Password.findAll({
      attributes: ['id', 'value', 'length', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};