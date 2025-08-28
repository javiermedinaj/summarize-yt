import { generateFlashcardsFromText } from '../services/openai.service.js';
import { saveFlashcards } from '../services/storage.service.js';

export async function handleTextFlashcards(text) {
    try {
        const flashcards = await generateFlashcardsFromText(text, 5);
        
        // Guardar flashcards (usamos un ID temporal ya que no tenemos videoId aquí)
        const tempId = `flashcards_${Date.now()}`;
        await saveFlashcards(tempId, flashcards);
        
        return {
            success: true,
            flashcards: flashcards
        };
    } catch (error) {
        console.error('Error generating flashcards:', error);
        throw new Error('Failed to generate flashcards from text');
    }
}