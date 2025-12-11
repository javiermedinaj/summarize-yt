console.log('Storage service iniciado para entorno serverless');

export async function saveVideoData(videoId, data) {
    try {
        console.log(`Datos procesados para video: ${videoId}`);
        console.log(`Tipo de datos:`, Object.keys(data));
        
        const filename = `${videoId}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        console.log(`Simulación de guardado: ${filename}`);
        
        return filename;
    } catch (error) {
        console.error('Error procesando datos:', error);
        throw new Error('Failed to process video data');
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
