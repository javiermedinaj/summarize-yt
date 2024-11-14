// controllers/flashcards.controller.js
import { generateFlashcardsFromText, summarizeText } from '../services/openai.service.js';
import { extractTextFromPDF } from '../services/pdf.service.js';
import { getVideoSubtitles } from '../services/subtitle.service.js';

export async function handlePDFFlashcards(file) {
    const text = await extractTextFromPDF(file);
    const summary = await summarizeText(text.fullText);
    return generateFlashcardsFromText(summary);
}

export async function handleVideoFlashcards(videoId) {
    try {
        const subtitles = await getVideoSubtitles(videoId);
        const summary = await summarizeText(subtitles);
        return generateFlashcardsFromText(summary);
    } catch (error) {
        console.error('Error processing video flashcards:', error);
        throw new Error('Failed to generate flashcards from video');
    }
}