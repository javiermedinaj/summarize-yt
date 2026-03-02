import fetch from 'node-fetch';
import { URL } from 'url';
import Subtitle from '../models/Subtitle.js';

function extractVideoId(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        return urlObj.searchParams.get('v');
    } catch (error) {
        throw new Error('Invalid YouTube URL');
    }
}

// Usar TranscriptAPI.com
async function getTranscriptFromAPI(videoUrl) {
    const TRANSCRIPT_API_KEY = process.env.TRANSCRIPT_API_KEY;
    
    if (!TRANSCRIPT_API_KEY) {
        throw new Error('❌ TRANSCRIPT_API_KEY no está configurada. Por favor, agrega tu API key de TranscriptAPI.com en el archivo .env');
    }

    try {
        const videoId = extractVideoId(videoUrl);
        const apiUrl = `https://transcriptapi.com/api/v2/youtube/transcript?video_url=${videoId}&format=json`;
        
        console.log(`🔑 Usando TranscriptAPI.com para video: ${videoId}`);
        console.log(`📋 API Key configurada: ${TRANSCRIPT_API_KEY.substring(0, 10)}...`);
        
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${TRANSCRIPT_API_KEY}`
            },
            timeout: 30000
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ TranscriptAPI error (${response.status}): ${errorText}`);
            throw new Error(`TranscriptAPI error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.transcript || data.transcript.length === 0) {
            throw new Error('El video no tiene subtítulos disponibles');
        }

        // Concatenar todos los fragmentos de texto
        const fullText = data.transcript.map(item => item.text).join(' ');
        
        console.log(`✅ Transcript obtenido exitosamente`);
        console.log(`📊 Idioma: ${data.language}, Fragmentos: ${data.transcript.length}, Caracteres: ${fullText.length}`);
        
        return fullText;
        
    } catch (error) {
        console.error(`❌ Error en getTranscriptFromAPI: ${error.message}`);
        throw error;
    }
}

export async function getVideoSubtitles(videoUrl) {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
        throw new Error('Invalid YouTube URL');
    }

    try {
        // Verificar si ya existe en la base de datos
        const existingSubtitle = await Subtitle.findOne({ videoId });
        if (existingSubtitle) {
            console.log(`📦 Subtítulos encontrados en cache para: ${videoId}`);
            return {
                text: existingSubtitle.content,
                videoId: existingSubtitle.videoId,
                fromCache: true,
                _id: existingSubtitle._id,
                subtitleDoc: existingSubtitle
            };
        }

        console.log(`🎥 Extrayendo subtítulos para video: ${videoId}`);
        
        const subtitles = await getTranscriptFromAPI(videoUrl);
        
        if (!subtitles || subtitles.length === 0) {
            throw new Error('No subtitles found for this video');
        }
        
        console.log(`✅ Subtítulos extraídos: ${subtitles.length} caracteres`);
        
        // Guardar en MongoDB
        const savedSubtitle = await Subtitle.create({
            videoId,
            videoUrl,
            content: subtitles,
            wordCount: subtitles.split(' ').length
        });

        console.log(`📝 Subtítulos guardados en MongoDB con ID: ${savedSubtitle._id}`);
        
        return {
            text: subtitles,
            videoId,
            fromCache: false,
            _id: savedSubtitle._id,
            subtitleDoc: savedSubtitle
        };

    } catch (error) {
        console.error('❌ Error downloading subtitles:', error.message);
        throw new Error(`Failed to download subtitles: ${error.message}`);
    }
}

export async function getAllSubtitles(limit = 50) {
    return await Subtitle.find()
        .sort({ extractedAt: -1 })
        .limit(limit)
        .select('-content'); // Excluir el contenido completo para listar
}

export async function getSubtitleById(id) {
    return await Subtitle.findById(id);
}

export async function getSubtitlesByVideoId(videoId) {
    return await Subtitle.find({ videoId }).sort({ extractedAt: -1 });
}

export async function deleteSubtitle(id) {
    return await Subtitle.findByIdAndDelete(id);
}
