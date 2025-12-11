import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import videoRouter from './routes/video.routes.js';
import flashcardsRouter from './routes/flashcards.routes.js';
import subtitlesRouter from './routes/subtitles.routes.js';
import promptsRouter from './routes/prompt.routes.js';

dotenv.config();

const app = express();

connectDB();

// Configuración de CORS para producción y desarrollo
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir requests sin origin (como mobile apps o curl)
        if (!origin) return callback(null, true);
        
        // En desarrollo, permitir todo
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // En producción, verificar lista de orígenes permitidos
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            console.warn(`🚫 CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use('/api/video', videoRouter);
app.use('/api/flashcards', flashcardsRouter);
app.use('/api/subtitles', subtitlesRouter);
app.use('/api/prompts', promptsRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : err.message 
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

export default app;