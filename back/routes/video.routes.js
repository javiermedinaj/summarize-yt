import express from 'express';
import Joi from 'joi';
import { getVideoSubtitles } from '../services/subtitle.service.js';
import { summarizeText } from '../services/openai.service.js';

const router = express.Router();

const videoUrlSchema = Joi.object({
    videoUrl: Joi.string().uri().required()
});

router.post('/extract-summary', async (req, res, next) => {
    try {
        const { error } = videoUrlSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { videoUrl } = req.body;
        const subtitles = await getVideoSubtitles(videoUrl);
        const summary = await summarizeText(subtitles.text);
        
        res.json({
            success: true,
            summary,
            videoId: subtitles.videoId
        });
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to process video'
        });
    }
});

router.post('/extract-subtitles', async (req, res, next) => {
    try {
        const { error } = videoUrlSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { videoUrl } = req.body;
        const subtitles = await getVideoSubtitles(videoUrl);
        
        res.json({
            success: true,
            subtitles: subtitles.text,
            videoId: subtitles.videoId
        });
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to extract subtitles'
        });
    }
});

export default router;