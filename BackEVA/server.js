import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import claseRoute from './routes/claseRoute.js';
import videoRoute from './routes/videoRoute.js';
import questionRoute from './routes/questionRoute.js';
import userRoutes from './routes/userRoutes.js';
import attemptRoute from './routes/attemptRoute.js';
import scormRoute from './routes/scormRoute.js';

// Conexion BD
import connectDB from './config/db.js';

// Configure env
dotenv.config();

// Database config
connectDB();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear la carpeta 'video' si no existe
const videoDir = path.join(__dirname, 'video');
if (!fs.existsSync(videoDir)){
    fs.mkdirSync(videoDir);
}

// Rest object 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/clase', claseRoute);
app.use('/api/video', videoRoute);
app.use('/api/pregunta', questionRoute);
app.use('/api/attempt', attemptRoute);
app.use('/api/scorm', scormRoute);
app.use('/video', express.static(path.join(__dirname, 'video')));
app.use('/api', userRoutes);

// API rest 
app.get('/', (req, res) => {
    res.send('<h1>Welcome to backEVA app</h1>');
});

// PORT
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
});
