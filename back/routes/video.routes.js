import express from 'express';
import Joi from 'joi';
import { extractSubtitles } from '../services/video.service.js';
import { handleVideoFlashcards } from '../controllers/flashcards.controller.js';
import { summarizeText } from '../services/openai.service.js';

const router = express.Router();

const videoUrlSchema = Joi.object({
    videoUrl: Joi.string().uri().required()
});

router.post('/extract-subtitles', async (req, res, next) => {
    try {
        const { error } = videoUrlSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { videoUrl } = req.body;
        const subtitles = await extractSubtitles(videoUrl);
        const flashcards = await handleVideoFlashcards(subtitles.text);
        
        res.json({
            success: true,
            flashcards,
            videoTitle: subtitles.videoTitle
        });
    } catch (error) {
        next(error);
    }
});

router.post('/extract-summary', async (req, res, next) => {
    try {
        const { error } = videoUrlSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { videoUrl } = req.body;
        const subtitles = await extractSubtitles(videoUrl);
        const summary = await summarizeText(subtitles.text);
        
        res.json({
            success: true,
            summary,
            videoTitle: subtitles.videoTitle
        });
    } catch (error) {
        next(error);
    }
});

export default router;