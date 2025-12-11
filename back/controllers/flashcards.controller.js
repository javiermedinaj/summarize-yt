import { generateFlashcardsFromText } from '../services/openai.service.js';
import { saveFlashcardSet } from '../services/flashcard.service.js';
import Joi from 'joi';

const textSchema = Joi.object({
    text: Joi.string().min(10).required()
});

export async function handleGenerateFlashcards(req, res) {
    try {
        console.log(' Generando flashcards...');
        
        const { error } = textSchema.validate(req.body);
        if (error) {
            console.log('❌ Error de validación:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }
        
        const { text } = req.body;
        
        if (!text) {
            console.log(' Texto no proporcionado');
            return res.status(400).json({ error: 'Text is required' });
        }
        
        console.log(`Texto recibido: ${text.length} caracteres`);
        
        const flashcards = await generateFlashcardsFromText(text, 6);
        console.log(`✅ Flashcards generadas: ${flashcards.length}`);
        
        // Guardar en MongoDB (necesitamos un subtitleId dummy o lo hacemos opcional)
        let savedFlashcardSet = null;
        try {
            // Por ahora guardamos con un videoId temporal
            const tempVideoId = `temp_${Date.now()}`;
            savedFlashcardSet = await saveFlashcardSet({
                subtitleId: null, // Opcional si es solo texto
                videoId: tempVideoId,
                videoTitle: 'Flashcards from text',
                flashcards: flashcards,
                metadata: {
                    generatedBy: 'Azure OpenAI',
                    generationTime: Date.now()
                }
            });
            console.log('💾 Flashcards guardadas en MongoDB');
        } catch (saveError) {
            console.error('⚠️ Error guardando flashcards:', saveError.message);
            // Continuar sin guardar
        }
        
        const response = {
            success: true,
            flashcards: flashcards,
            savedToMongo: !!savedFlashcardSet,
            flashcardSetId: savedFlashcardSet?._id
        };
        
        console.log('📤 Enviando respuesta de flashcards...');
        res.json(response);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate flashcards from text'
        });
    }
}

export async function handleTextFlashcards(text) {
    try {
        const flashcards = await generateFlashcardsFromText(text, 6);
        //guardar flashcards
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