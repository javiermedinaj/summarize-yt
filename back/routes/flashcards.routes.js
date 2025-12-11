import express from 'express';
import { handleGenerateFlashcards } from '../controllers/flashcards.controller.js';
import {
    getLatestFlashcardSets,
    getFlashcardSetsByVideoId,
    getFlashcardSetById,
    deleteFlashcardSet,
    getStatsByVideoId
} from '../services/flashcard.service.js';

const router = express.Router();

// POST /api/flashcards/generate - Generar flashcards desde texto
router.post('/generate', handleGenerateFlashcards);

// GET /api/flashcards - Obtener últimos sets de flashcards
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const flashcards = await getLatestFlashcardSets(limit);
        res.json({ success: true, data: flashcards, count: flashcards.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/flashcards/:id - Obtener set de flashcards por ID
router.get('/:id', async (req, res) => {
    try {
        const flashcardSet = await getFlashcardSetById(req.params.id);
        if (!flashcardSet) {
            return res.status(404).json({ success: false, error: 'Flashcard set not found' });
        }
        res.json({ success: true, data: flashcardSet });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/flashcards/video/:videoId - Obtener flashcards por videoId
router.get('/video/:videoId', async (req, res) => {
    try {
        const flashcards = await getFlashcardSetsByVideoId(req.params.videoId);
        res.json({ success: true, data: flashcards, count: flashcards.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/flashcards/stats/:videoId - Obtener estadísticas por videoId
router.get('/stats/:videoId', async (req, res) => {
    try {
        const stats = await getStatsByVideoId(req.params.videoId);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/flashcards/:id - Eliminar set de flashcards
router.delete('/:id', async (req, res) => {
    try {
        const flashcardSet = await deleteFlashcardSet(req.params.id);
        if (!flashcardSet) {
            return res.status(404).json({ success: false, error: 'Flashcard set not found' });
        }
        res.json({ success: true, message: 'Flashcard set deleted', data: flashcardSet });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;