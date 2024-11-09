import express from 'express';
import { extractSubtitles } from '../services/video.service.js';
import { handleVideoFlashcards } from '../controllers/flashcards.controller.js';
import { summarizeText } from '../services/openai.service.js';
const router = express.Router();

router.post('/extract-subtitles', async (req, res) => {
    try {
        const { videoUrl } = req.body;
        const subtitles = await extractSubtitles(videoUrl);
        const flashcards = await handleVideoFlashcards(subtitles.text);
        
        res.json({
            success: true,
            flashcards,
            videoTitle: subtitles.videoTitle
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/extract-summary', async (req, res) => {
    try {
        const { videoUrl } = req.body;
        const subtitles = await extractSubtitles(videoUrl);
        const summary = await summarizeText(subtitles.text);
        
        res.json({
            success: true,
            summary,
            videoTitle: subtitles.videoTitle
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;