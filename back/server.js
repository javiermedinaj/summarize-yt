import express from 'express';
import cors from 'cors';
import videoRouter from './routes/video.routes.js';
import flashcardRouter from './routes/flashcards.routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/api/video', videoRouter);
app.use('/api/flashcards', flashcardRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});