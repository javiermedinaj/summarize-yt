import express from 'express';
import cors from 'cors';
import videoRouter from './routes/video.routes.js';
import flashcardRouter from './routes/flashcards.routes.js';

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

app.get('/api/test', (req, res) => {
    res.json({ message: 'apiworking' });
});

app.use('/api/video', videoRouter);
app.use('/api/flashcards', flashcardRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

export default app;