import fetch from 'node-fetch';
import { URL } from 'url';

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

async function getSubtitlesFromYouTubeTranscript(videoUrl) {
    try {
        const videoId = extractVideoId(videoUrl);
        const transcriptUrl = `https://youtubetotranscript.com/transcript?v=${videoId}`;
        
        console.log(`🔍 Navegando a: ${transcriptUrl}`);
        
        const response = await fetch(transcriptUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch transcript page: ${response.status}`);
        }

        const html = await response.text();
        
        console.log(`📄 HTML obtenido, longitud: ${html.length} caracteres`);
        
        const segmentMatches = html.match(/<span[^>]*class="[^"]*transcript-segment[^"]*"[^>]*>([^<]*)<\/span>/gi);
        
        if (segmentMatches && segmentMatches.length > 0) {
            console.log(`✅ Encontrados ${segmentMatches.length} segmentos de transcript`);
            
            const transcriptTexts = segmentMatches.map(match => {
                const textMatch = match.match(/>([^<]*)</);
                return textMatch ? textMatch[1].trim() : '';
            }).filter(text => text.length > 0);
            
            if (transcriptTexts.length > 0) {
                const fullTranscript = transcriptTexts.join(' ');
                console.log(`📝 Transcript extraído: ${fullTranscript.length} caracteres`);
                return fullTranscript;
            }
        }
        
        const contentMatch = html.match(/<span[^>]*>([^<]*you are making[^<]*)<\/span>/i);
        if (contentMatch) {
            console.log('✅ Encontrado por contenido específico');
            return cleanTranscriptContent(contentMatch[1]);
        }
        
        const divMatches = html.match(/<div[^>]*>([^<]{200,})<\/div>/g);
        if (divMatches) {
            let longestContent = '';
            for (const match of divMatches) {
                const content = match.replace(/<[^>]*>/g, '').trim();
                if (content.length > longestContent.length && content.includes(' ')) {
                    longestContent = content;
                }
            }
            if (longestContent.length > 100) {
                console.log('✅ Encontrado por div con más contenido');
                return cleanTranscriptContent(longestContent);
            }
        }
        
        throw new Error('No transcript content found on the page');
        
    } catch (error) {
        console.error('Error getting transcript from YouTubeTranscript:', error);
        throw new Error(`Failed to get transcript: ${error.message}`);
    }
}

function cleanTranscriptContent(htmlContent) {
    let cleaned = htmlContent
        .replace(/<[^>]*>/g, '') 
        
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/\s+/g, ' ')
        .replace(/Copy Timestamp OFF/g, '')
        .replace(/Copy Timestamp ON/g, '')
        .trim();
    
    return cleaned;
}

export async function getVideoSubtitles(videoUrl) {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
        throw new Error('Invalid YouTube URL');
    }

    try {
        console.log(`🎥 Extrayendo subtítulos para video: ${videoId}`);
        
        const subtitles = await getSubtitlesFromYouTubeTranscript(videoUrl);
        
        if (!subtitles || subtitles.length === 0) {
            throw new Error('No subtitles found for this video');
        }
        
        console.log(`✅ Subtítulos extraídos: ${subtitles.length} caracteres`);
        
        return {
            text: subtitles,
            videoId
        };

    } catch (error) {
        console.error('Error downloading subtitles:', error);
        throw new Error(`Failed to download subtitles: ${error.message}`);
    }
}