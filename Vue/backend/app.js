const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Importar rutas
const taskRoutes = require('./routes/tasks');
const converterRoutes = require('./routes/converter');
const passwordRoutes = require('./routes/passwords');
const surveyRoutes = require('./routes/surveys');
const eventRoutes = require('./routes/events');



// await Survey.sync();
// await SurveyResponse.sync();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/tasks', taskRoutes);
app.use('/api/converter', converterRoutes);
app.use('/api/passwords', passwordRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/events', eventRoutes);

// Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Base de datos conectada');
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
}

startServer();