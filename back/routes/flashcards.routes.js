import express from 'express';
import multer from 'multer';
import { handlePDFFlashcards } from '../controllers/flashcards.controller.js';

const router = express.Router();
const upload = multer();

router.post('/generate-flashcards', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }
        const flashcards = await handlePDFFlashcards(req.file);
        res.json(flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;