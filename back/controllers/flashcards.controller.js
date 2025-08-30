import { generateFlashcardsFromText } from '../services/openai.service.js';
import { saveFlashcards } from '../services/storage.service.js';
import Joi from 'joi';

const textSchema = Joi.object({
    text: Joi.string().min(10).required()
});

export async function handleGenerateFlashcards(req, res) {
    try {
        console.log('🔄 Generando flashcards...');
        
        const { error } = textSchema.validate(req.body);
        if (error) {
            console.log('❌ Error de validación:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }
        
        const { text } = req.body;
        
        if (!text) {
            console.log('❌ Texto no proporcionado');
            return res.status(400).json({ error: 'Text is required' });
        }
        
        console.log(`📝 Texto recibido: ${text.length} caracteres`);
        
        const flashcards = await generateFlashcardsFromText(text, 5);
        console.log(`✅ Flashcards generadas: ${flashcards.length}`);
        
        // Guardar flashcards (usamos un ID temporal ya que no tenemos videoId aquí)
        const tempId = `flashcards_${Date.now()}`;
        await saveFlashcards(tempId, flashcards);
        
        const response = {
            success: true,
            flashcards: flashcards
        };
        
        console.log('📤 Enviando respuesta de flashcards...');
        res.json(response);
    } catch (error) {
        console.error('❌ Error generating flashcards:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate flashcards from text'
        });
    }
}

// Mantener la función original para compatibilidad
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