import { getVideoSubtitles } from '../services/subtitle.service.js';
import { summarizeText, generateFlashcardsFromText } from '../services/openai.service.js';
import { generateDeepDivePrompt, saveGeneratedPrompts, getGeneratedPromptsByVideoId } from '../services/prompt.service.js';
import { saveFlashcardSet, getFlashcardSetsByVideoId } from '../services/flashcard.service.js';
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

        // 🔍 Verificar si ya existe un resultado completo en cache
        console.log(`🔍 Verificando cache completo para video: ${videoId}`);
        const cachedPrompts = await getGeneratedPromptsByVideoId(videoId);
        const cachedFlashcards = await getFlashcardSetsByVideoId(videoId);
        
        // Validar que el cache esté completo y tenga todos los datos necesarios
        const hasValidCache = cachedPrompts 
            && cachedPrompts.length > 0 
            && cachedFlashcards 
            && cachedFlashcards.length > 0
            && cachedPrompts[0].deepDivePrompts 
            && cachedPrompts[0].deepDivePrompts.length >= 5  // Debe tener al menos 5 prompts
            && cachedPrompts[0].summary?.content;  // Debe tener summary
        
        if (hasValidCache) {
            const latestPrompt = cachedPrompts[0];
            const latestFlashcardSet = cachedFlashcards[0];
            
            console.log('📦 ¡Resultado completo encontrado en cache!');
            console.log(`   - Summary: ${latestPrompt.summary?.content?.length || 0} caracteres`);
            console.log(`   - Prompts: ${latestPrompt.deepDivePrompts?.length || 0}`);
            console.log(`   - Flashcards: ${latestFlashcardSet.flashcards?.length || 0}`);
            
            // Obtener subtítulos para la respuesta (también usa cache)
            const subtitlesResult = await getVideoSubtitles(videoUrl);
            
            return res.json({
                success: true,
                summary: latestPrompt.summary?.content || '',
                subtitles: subtitlesResult.text || '',
                deepDivePrompts: latestPrompt.deepDivePrompts || [],
                totalPrompts: latestPrompt.deepDivePrompts?.length || 0,
                flashcards: latestFlashcardSet.flashcards || [],
                videoId,
                savedToMongo: true,
                fromCache: true
            });
        }
        
        if (cachedPrompts && cachedPrompts.length > 0) {
            console.log('⚠️ Cache incompleto detectado (faltan prompts o datos incompletos), regenerando...');
        } else {
            console.log('🆕 No hay cache, generando nuevo contenido...');
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
        const summary = await summarizeText(subtitlesResult.text);
        console.log('✅ Summary generado correctamente');
    
        console.log('🔍 Generando 5 deep dive prompts autocontenidos...');
        let promptResult = null;
        try {
            promptResult = await generateDeepDivePrompt(subtitlesResult.text);
            console.log(`✅ ${promptResult.totalPrompts} prompts generados correctamente`);
            
            // DEBUG: Verificar estructura de prompts
            if (promptResult.prompts && promptResult.prompts.length > 0) {
                console.log('📋 Primer prompt generado:', {
                    number: promptResult.prompts[0].number,
                    title: promptResult.prompts[0].title,
                    contentLength: promptResult.prompts[0].content?.length || 0
                });
            } else {
                console.warn('⚠️ prompts array está vacío o undefined');
            }
        } catch (promptError) {
            console.error('❌ Error generando prompts:', promptError.message);
            promptResult = {
                prompts: [],
                totalPrompts: 0,
                error: promptError.message
            };
        }

        // 💾 Guardar prompts y summary en MongoDB
        try {
            if (promptResult && promptResult.prompts && subtitlesResult._id) {
                await saveGeneratedPrompts({
                    subtitleId: subtitlesResult._id,
                    videoId: videoId,
                    videoTitle: `Video ${videoId}`,
                    deepDivePrompts: promptResult.prompts.map(p => ({
                        number: p.number,
                        title: p.title,
                        content: p.content,
                        category: categorizeTitleToEnum(p.title)
                    })),
                    summary: {
                        title: 'Resumen Ejecutivo',
                        content: summary
                    },
                    metadata: {
                        generatedBy: 'Azure OpenAI',
                        generationTime: Date.now()
                    }
                });
                console.log(`💾 ${promptResult.totalPrompts} prompts y summary guardados en MongoDB`);
            }
        } catch (saveError) {
            console.error('⚠️ Error guardando prompts:', saveError.message);
            // No fallamos la request si falla el guardado
        }

        // 🎴 Generar y guardar flashcards
        let flashcards = [];
        try {
            console.log('🎴 Generando flashcards...');
            flashcards = await generateFlashcardsFromText(subtitlesResult.text, 6);
            console.log(`✅ ${flashcards.length} flashcards generadas`);
            
            if (flashcards.length > 0 && subtitlesResult._id) {
                await saveFlashcardSet({
                    subtitleId: subtitlesResult._id,
                    videoId: videoId,
                    videoTitle: `Video ${videoId}`,
                    flashcards: flashcards,
                    metadata: {
                        generatedBy: 'Azure OpenAI',
                        generationTime: Date.now()
                    }
                });
                console.log('💾 Flashcards guardadas en MongoDB');
            }
        } catch (flashcardError) {
            console.error('⚠️ Error generando/guardando flashcards:', flashcardError.message);
            // No fallamos la request si falla las flashcards
        }
        
        console.log('📤 Enviando respuesta completa...');
        res.json({
            success: true,
            summary,
            subtitles,
            deepDivePrompts: promptResult?.prompts || [],
            totalPrompts: promptResult?.totalPrompts || 0,
            flashcards,
            videoId,
            savedToMongo: true
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

function categorizeTitleToEnum(title) {
    const titleUpper = title.toUpperCase();
    if (titleUpper.includes('GENERAL')) return 'analisis_general';
    if (titleUpper.includes('CRÍTICO') || titleUpper.includes('CRITICO')) return 'analisis_critico';
    if (titleUpper.includes('PRÁCTICA') || titleUpper.includes('PRACTICA') || titleUpper.includes('APLICACIÓN')) return 'aplicacion_practica';
    if (titleUpper.includes('CONTEXTO') || titleUpper.includes('AMPLIADO')) return 'contexto_ampliado';
    if (titleUpper.includes('PENSAMIENTO') || titleUpper.includes('CRÍTICO')) return 'pensamiento_critico';
    return 'analisis_general';
}
