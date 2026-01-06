import fetch from 'node-fetch';
import { URL } from 'url';
import chromium from 'chrome-aws-lambda';
import Subtitle from '../models/Subtitle.js';

// puppeteer-core solo para desarrollo local
let puppeteerLocal;
try {
    // En producción (Render), esto puede fallar y está bien
    const puppeteerModule = await import('puppeteer-core');
    puppeteerLocal = puppeteerModule.default;
} catch (error) {
    // En Render, usaremos chromium.puppeteer directamente
    puppeteerLocal = null;
}

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

// Función auxiliar para extraer transcript del HTML
function extractTranscriptFromHtml(html) {
    // Método 1: Buscar segmentos con clase transcript-segment
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
    
    // Método 2: Buscar en divs con contenido largo
    const divMatches = html.match(/<div[^>]*>([^<]{200,})<\/div>/g);
    if (divMatches) {
        let longestContent = '';
        for (const match of divMatches) {
            const content = match.replace(/<[^>]*>/g, '').trim();
            if (content.length > longestContent.length && content.split(' ').length > 20) {
                longestContent = content;
            }
        }
        if (longestContent.length > 100) {
            console.log('✅ Encontrado por div con más contenido');
            return longestContent;
        }
    }
    
    return null;
}

// Intento rápido con fetch (sin JavaScript)
async function getSubtitlesWithFetch(videoUrl) {
    try {
        const videoId = extractVideoId(videoUrl);
        const transcriptUrl = `https://youtubetotranscript.com/transcript?v=${videoId}`;
        
        console.log(`🚀 Intento rápido con fetch: ${transcriptUrl}`);
        
        // Delay inicial para simular comportamiento humano
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(transcriptUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
                'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"'
            }
        });

        if (!response.ok) {
            console.log(`⚠️ Fetch falló con código: ${response.status}`);
            return null;
        }

        const html = await response.text();
        console.log(`📄 HTML obtenido con fetch: ${html.length} caracteres`);
        
        const transcriptText = extractTranscriptFromHtml(html);
        
        if (transcriptText && transcriptText.length > 100) {
            console.log(`✅ Transcript obtenido con fetch exitosamente`);
            return cleanTranscriptContent(transcriptText);
        }
        
        console.log(`⚠️ No se encontró transcript válido en el HTML con fetch`);
        return null;
        
    } catch (error) {
        console.log(`⚠️ Error en fetch: ${error.message}`);
        return null;
    }
}

// Intento con Puppeteer (con JavaScript y evitando Cloudflare)
async function getSubtitlesWithPuppeteer(videoUrl) {
    let browser = null;
    try {
        const videoId = extractVideoId(videoUrl);
        const transcriptUrl = `https://youtubetotranscript.com/transcript?v=${videoId}`;
        
        console.log(`🤖 Usando Puppeteer para: ${transcriptUrl}`);
        
        // Detectar si estamos en entorno local o serverless
        // Render.com detecta por RENDER variable de entorno
        const isServerless = process.env.NODE_ENV === 'production' 
            || process.env.AWS_LAMBDA_FUNCTION_NAME 
            || process.env.VERCEL
            || process.env.RENDER;
        
        const isLocal = !isServerless;
        
        console.log(`🔧 Entorno detectado: ${isLocal ? 'Local' : 'Serverless (Render/Vercel/Lambda)'}`);
        console.log(`📊 Variables de entorno: NODE_ENV=${process.env.NODE_ENV}, RENDER=${process.env.RENDER}, VERCEL=${process.env.VERCEL}`);
        
        // Iniciar Puppeteer con configuración apropiada
        if (isLocal && puppeteerLocal) {
            // Configuración para desarrollo local
            console.log(`🖥️ Usando Chrome local para desarrollo`);
            browser = await puppeteerLocal.launch({
                headless: 'new',
                executablePath: process.env.CHROME_EXECUTABLE_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu'
                ]
            });
        } else {
            // Configuración para Render/Vercel/serverless usando chrome-aws-lambda
            console.log(`🚀 Usando chrome-aws-lambda para entorno serverless`);
            browser = await chromium.puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });
        }
        
        console.log(`✅ Navegador lanzado exitosamente`);

        const page = await browser.newPage();
        
        // Configurar para parecer un navegador real
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Bloquear recursos innecesarios para acelerar
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const resourceType = req.resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                req.abort();
            } else {
                req.continue();
            }
        });
        
        // Eliminar la propiedad webdriver para evitar detección
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
        });

        console.log(`🌐 Cargando página con Puppeteer...`);
        
        // Navegar a la página con timeout extendido para Cloudflare
        await page.goto(transcriptUrl, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log(`⏳ Esperando Cloudflare...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        try {
            await page.waitForSelector('span.transcript-segment, .transcript-segment, [class*="transcript"]', {
                timeout: 30000
            });
            console.log(`✅ Contenido del transcript detectado`);
        } catch (waitError) {
            console.log(`⚠️ Selector no encontrado, intentando métodos alternativos...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        const html = await page.content();
        console.log(`📄 HTML obtenido con Puppeteer: ${html.length} caracteres`);
        
        let transcriptText = null;
        
        // Método 1: Buscar con evaluación en el DOM
        try {
            const segmentElements = await page.$$eval('span.transcript-segment, .transcript-segment, [class*="transcript-segment"]', 
                elements => elements.map(el => el.textContent?.trim()).filter(text => text && text.length > 0)
            );
            
            if (segmentElements && segmentElements.length > 0) {
                console.log(`✅ Encontrados ${segmentElements.length} segmentos de transcript (DOM)`);
                transcriptText = segmentElements.join(' ');
            }
        } catch (e) {
            console.log(`⚠️ No se pudo evaluar en el DOM`);
        }
        
        // Método 2: Extraer del HTML
        if (!transcriptText || transcriptText.length < 50) {
            transcriptText = extractTranscriptFromHtml(html);
        }
        
        // Método 3: Buscar cualquier contenido largo
        if (!transcriptText || transcriptText.length < 50) {
            console.log(`🔍 Buscando contenido alternativo en el DOM...`);
            
            try {
                const allTextElements = await page.$$eval('span, div, p', 
                    elements => {
                        return elements
                            .map(el => ({ text: el.textContent?.trim() || '', length: (el.textContent?.trim() || '').length }))
                            .filter(item => item.length > 100)
                            .sort((a, b) => b.length - a.length)
                            .slice(0, 5)
                            .map(item => item.text);
                    }
                );
                
                if (allTextElements && allTextElements.length > 0) {
                    const longestText = allTextElements.find(text => text.split(' ').length > 20);
                    if (longestText) {
                        console.log(`✅ Encontrado contenido alternativo: ${longestText.length} caracteres`);
                        transcriptText = longestText;
                    }
                }
            } catch (e) {
                console.log(`⚠️ No se pudo buscar contenido alternativo`);
            }
        }
        
        if (!transcriptText || transcriptText.length < 50) {
            throw new Error('No transcript content found on the page');
        }
        
        const cleanedTranscript = cleanTranscriptContent(transcriptText);
        console.log(`📝 Transcript extraído con Puppeteer: ${cleanedTranscript.length} caracteres`);
        
        return cleanedTranscript;
        
    } catch (error) {
        console.error('Error getting transcript with Puppeteer:', error);
        throw new Error(`Failed to get transcript with Puppeteer: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
            console.log(`🔒 Navegador cerrado`);
        }
    }
}

// Función principal que intenta fetch primero, luego Puppeteer
async function getSubtitlesFromYouTubeTranscript(videoUrl) {
    console.log(`🎬 Iniciando extracción de subtítulos...`);
    
    // Intento 1: Fetch rápido (sin JavaScript)
    const fetchResult = await getSubtitlesWithFetch(videoUrl);
    if (fetchResult) {
        console.log(`✅ Subtítulos obtenidos con fetch (método rápido)`);
        return fetchResult;
    }
    
    // Intento 2: Puppeteer (con JavaScript, evita Cloudflare)
    console.log(`🔄 Fetch falló, intentando con Puppeteer...`);
    const puppeteerResult = await getSubtitlesWithPuppeteer(videoUrl);
    
    if (puppeteerResult) {
        console.log(`✅ Subtítulos obtenidos con Puppeteer (método completo)`);
        return puppeteerResult;
    }
    
    throw new Error('Failed to get transcript with both methods');
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
        
        const subtitles = await getSubtitlesFromYouTubeTranscript(videoUrl);
        
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

        console.log(`Subtítulos guardados en MongoDB con ID: ${savedSubtitle._id}`);
        
        return {
            text: subtitles,
            videoId,
            fromCache: false,
            _id: savedSubtitle._id,
            subtitleDoc: savedSubtitle
        };

    } catch (error) {
        console.error('Error downloading subtitles:', error);
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