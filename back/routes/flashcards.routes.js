import express from 'express';
import { handleGenerateFlashcards } from '../controllers/flashcards.controller.js';

const router = express.Router();

router.post('/generate', handleGenerateFlashcards);

export default router;