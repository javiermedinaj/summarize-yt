import express from 'express';
import cors from 'cors';
import videoRouter from './routes/video.routes.js';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://summarize-ai-yt.vercel.app/'],
    methods: ['GET', 'POST'],
}));

app.use(express.json());
app.use('/api/video', videoRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

export default app;