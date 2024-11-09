import ytdl from 'ytdl-core';
import fetch from 'node-fetch';

export async function extractSubtitles(videoUrl) {
    if (!ytdl.validateURL(videoUrl)) {
        throw new Error('URL de video inválida');
    }

    const videoInfo = await ytdl.getInfo(videoUrl);
    
    const captions = videoInfo.player_response.captions;
    const captionTracks = captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captionTracks || captionTracks.length === 0) {
        throw new Error('No se encontraron subtítulos para este video');
    }

    const subtitleTrack = captionTracks.find(track => 
        track.languageCode === 'en' || track.languageCode === 'en-US'
    ) || captionTracks.find(track => 
        track.languageCode === 'es' || track.languageCode === 'es-419'
    ) || captionTracks[0];

    const subtitleUrl = `${subtitleTrack.baseUrl}&fmt=srv3`;

    const response = await fetch(subtitleUrl);
    const subtitleData = await response.text();

    const cleanText = subtitleData
        .replace(/<[^>]*>/g, '\n') 
        .replace(/\n\s*\n/g, '\n')  
        .trim();

    return {
        text: cleanText,
        videoTitle: videoInfo.videoDetails.title,
        language: subtitleTrack.languageCode
    };
}