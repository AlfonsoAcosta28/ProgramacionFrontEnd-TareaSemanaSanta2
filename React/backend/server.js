const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

// Importar modelos
require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const currencyRoutes = require('./routes/currency');
const passwordRoutes = require('./routes/passwords');
const surveyRoutes = require('./routes/surveys');
const eventRoutes = require('./routes/events');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/events', eventRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Sincronizar base de datos y iniciar servidor
sequelize.sync({ force: false }).then(() => {
  console.log('Base de datos conectada');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`URL de la API: http://localhost:${PORT}/api`);
  });
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});