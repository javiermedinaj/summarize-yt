import { Router } from 'express';
import { generateDeepDivePrompt } from '../services/prompt.service.js';

const router = Router();

router.post('/generate', async (req, res) => {
    try {
        const { content, area } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const prompt = await generateDeepDivePrompt(content, area);
        res.json(prompt);
    } catch (error) {
        console.error('Error in prompt generation:', error);
        res.status(500).json({ error: 'Error generating prompt' });
    }
});

export default router;
