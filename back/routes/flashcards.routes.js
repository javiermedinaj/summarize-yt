import express from 'express';
import Joi from 'joi';
import { handleTextFlashcards } from '../controllers/flashcards.controller.js';

const router = express.Router();

const textSchema = Joi.object({
    text: Joi.string().min(10).required()
});

router.post('/generate', async (req, res) => {
    try {
        const { error } = textSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { text } = req.body;
        const result = await handleTextFlashcards(text);
        
        res.json(result);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate flashcards'
        });
    }
});

export default router;