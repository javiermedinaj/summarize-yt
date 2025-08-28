import { getVideoSubtitles } from '../services/subtitle.service.js';
import { summarizeText } from '../services/openai.service.js';
import { saveSummary, saveSubtitles, saveCompleteAnalysis } from '../services/storage.service.js';

export async function handleExtractSummary(req, res) {
    try {
        const { videoUrl } = req.body;
        
        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        console.log(`🎥 Extrayendo subtítulos para video: ${videoId}`);
        
        const subtitles = await getVideoSubtitles(videoId);
        
        if (!subtitles || subtitles.length < 100) {
            return res.status(400).json({ error: 'No subtitles found or subtitles too short' });
        }

        console.log(`📝 Transcript extraído: ${subtitles.length} caracteres`);
        
        const summary = await summarizeText(subtitles);
        
        await saveCompleteAnalysis(videoId, summary, subtitles, null);
        
        res.json({
            success: true,
            summary,
            videoId
        });
    } catch (error) {
        console.error('Error extracting summary:', error);
        res.status(500).json({ error: error.message || 'Failed to extract summary' });
    }
}

export async function handleExtractSubtitles(req, res) {
    try {
        const { videoUrl } = req.body;
        
        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        console.log(`🎥 Extrayendo subtítulos para video: ${videoId}`);
        
        const subtitles = await getVideoSubtitles(videoId);
        
        if (!subtitles || subtitles.length < 100) {
            return res.status(400).json({ error: 'No subtitles found or subtitles too short' });
        }

        console.log(`✅ Subtítulos extraídos: ${subtitles.length} caracteres`);
        
        await saveSubtitles(videoId, subtitles);
        
        res.json({
            success: true,
            subtitles,
            videoId
        });
    } catch (error) {
        console.error('Error extracting subtitles:', error);
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
