const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// Conectar a MongoDB 
connectDB();

// Middlewares
app.use(cors()); // Permite comunicación entre frontend y backend
app.use(express.json()); // Para parsear JSON

// Rutas de la API
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/movies', require('./routes/movies.routes'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend (Node.js) corriendo en puerto ${PORT}`));