import { generateFlashcardsFromText, summarizeText } from '../services/openai.service.js';
import { extractTextFromPDF } from '../services/pdf.service.js';

export async function handlePDFFlashcards(file) {
    const text = await extractTextFromPDF(file);
    const summary = await summarizeText(text.fullText);
    return generateFlashcardsFromText(summary);
}

export async function handleVideoFlashcards(subtitles) {
    const summary = await summarizeText(subtitles);
    return generateFlashcardsFromText(summary);
}