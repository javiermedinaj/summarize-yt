import { getVideoSubtitles } from '../services/subtitle.service.js';
import { summarizeText } from '../services/openai.service.js';
import { generateDeepDivePrompt } from '../services/prompt.service.js';
import Joi from 'joi';

const videoUrlSchema = Joi.object({
    videoUrl: Joi.string().uri().required()
});

export async function handleExtractSummary(req, res) {
    try {
        console.log('🎬 Iniciando extracción de summary...');
        
        const { error } = videoUrlSchema.validate(req.body);
        if (error) {
            console.error('❌ Error de validación:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        const { videoUrl } = req.body;
        console.log('📹 URL recibida:', videoUrl);
        
        if (!videoUrl) {
            console.error('❌ URL de video faltante');
            return res.status(400).json({ error: 'Video URL is required' });
        }

        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            console.error('❌ URL de YouTube inválida:', videoUrl);
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        console.log(`📝 Extrayendo subtítulos para video: ${videoId}`);
        
        const subtitlesResult = await getVideoSubtitles(videoUrl);
        const subtitles = subtitlesResult.text;
        
        if (!subtitles || subtitles.length < 100) {
            console.error('❌ Subtítulos no encontrados o muy cortos');
            return res.status(400).json({ error: 'No subtitles found or subtitles too short' });
        }

        console.log(`✅ Transcript extraído: ${subtitles.length} caracteres`);
        
        console.log('🤖 Generando summary...');
        const summary = await summarizeText(subtitles);
        console.log('✅ Summary generado correctamente');
    
        console.log('🔍 Generando deep dive prompt...');
        let prompt = null;
        try {
            prompt = await generateDeepDivePrompt(subtitles);
            console.log('✅ Prompt generado correctamente:', prompt ? 'OK' : 'NULL');
        } catch (promptError) {
            console.error('❌ Error generando prompt:', promptError.message);
            prompt = {
                mainPrompt: "Error generando prompt. Por favor, intenta nuevamente.",
                suggestedQuestions: [],
                context: { summary: "", keyPoints: [], relevantTopics: [] }
            };
        }
        
        console.log('📤 Enviando respuesta completa...');
        res.json({
            success: true,
            summary,
            subtitles,
            prompt,
            videoId
        });
    } catch (error) {
        console.error('❌ Error en handleExtractSummary:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: error.message || 'Failed to extract summary' });
    }
}

export async function handleExtractSubtitles(req, res) {
    try {
        console.log('📝 Iniciando extracción de subtítulos...');
        
        const { videoUrl } = req.body;
        
        if (!videoUrl) {
            console.error('❌ URL de video faltante');
            return res.status(400).json({ error: 'Video URL is required' });
        }

        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            console.error('❌ URL de YouTube inválida:', videoUrl);
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        console.log(`📝 Extrayendo subtítulos para video: ${videoId}`);
        
        const subtitlesResult = await getVideoSubtitles(videoUrl);
        const subtitles = subtitlesResult.text;
        
        if (!subtitles || subtitles.length < 100) {
            console.error('❌ Subtítulos no encontrados o muy cortos');
            return res.status(400).json({ error: 'No subtitles found or subtitles too short' });
        }

        console.log(`✅ Subtítulos extraídos: ${subtitles.length} caracteres`);
        
        res.json({
            success: true,
            subtitles,
            videoId
        });
    } catch (error) {
        console.error('❌ Error en handleExtractSubtitles:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: error.message || 'Failed to extract subtitles' });
    }
}

function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            if (urlObj.hostname.includes('youtu.be')) {
                return urlObj.pathname.slice(1);
            }
            return urlObj.searchParams.get('v');
        }
        return null;
    } catch {
        return null;
    }
}
