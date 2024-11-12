import express from 'express';
import cors from 'cors';
import videoRouter from './routes/video.routes.js';
import flashcardRouter from './routes/flashcards.routes.js';

const app = express();

const allowedOrigins = [
    'http://localhost:5173', 
    'https://summarize-yt.vercel.app'
];

app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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