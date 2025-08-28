import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resultsDir = path.join(__dirname, '..', 'results');
await fs.mkdir(resultsDir, { recursive: true }).catch(() => {});

export async function saveVideoData(videoId, data) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${videoId}_${timestamp}.json`;
        const filepath = path.join(resultsDir, filename);
        
        const dataToSave = {
            videoId,
            timestamp: new Date().toISOString(),
            ...data
        };
        
        await fs.writeFile(filepath, JSON.stringify(dataToSave, null, 2));
        console.log(`✅ Datos guardados en: ${filename}`);
        
        return filename;
    } catch (error) {
        console.error('Error guardando datos:', error);
        throw new Error('Failed to save video data');
    }
}

export async function saveSummary(videoId, summary) {
    return saveVideoData(videoId, { summary });
}

export async function saveSubtitles(videoId, subtitles) {
    return saveVideoData(videoId, { subtitles });
}

export async function saveFlashcards(videoId, flashcards) {
    return saveVideoData(videoId, { flashcards });
}

export async function saveCompleteAnalysis(videoId, summary, subtitles, flashcards) {
    return saveVideoData(videoId, { summary, subtitles, flashcards });
}
