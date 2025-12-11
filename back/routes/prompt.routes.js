import { Router } from 'express';
import { 
    generateDeepDivePrompt,
    getLatestGeneratedPrompts,
    getGeneratedPromptsByVideoId,
    getGeneratedPromptById,
    deleteGeneratedPrompt
} from '../services/prompt.service.js';

const router = Router();

// POST /api/prompts/generate - Generar prompt
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

// GET /api/prompts - Obtener últimos prompts generados
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const prompts = await getLatestGeneratedPrompts(limit);
        res.json({ success: true, data: prompts, count: prompts.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/prompts/:id - Obtener prompt por ID
router.get('/:id', async (req, res) => {
    try {
        const prompt = await getGeneratedPromptById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ success: false, error: 'Prompt not found' });
        }
        res.json({ success: true, data: prompt });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/prompts/video/:videoId - Obtener prompts por videoId
router.get('/video/:videoId', async (req, res) => {
    try {
        const prompts = await getGeneratedPromptsByVideoId(req.params.videoId);
        res.json({ success: true, data: prompts, count: prompts.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/prompts/:id - Eliminar prompt
router.delete('/:id', async (req, res) => {
    try {
        const prompt = await deleteGeneratedPrompt(req.params.id);
        if (!prompt) {
            return res.status(404).json({ success: false, error: 'Prompt not found' });
        }
        res.json({ success: true, message: 'Prompt deleted', data: prompt });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
