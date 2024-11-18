import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

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

export async function getVideoSubtitles(videoUrl) {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
        throw new Error('Invalid YouTube URL');
    }

    const tempDir = path.join(os.tmpdir(), `yt-subtitles-${videoId}`);
    const outputDir = path.join(process.cwd(), 'temp-subtitles');
    let browser;

    try {
        await fs.mkdir(tempDir, { recursive: true });
        await fs.mkdir(outputDir, { recursive: true });

        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        await page._client().send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: tempDir
        });

        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        await page.goto(`https://downsub.com/?url=${encodeURIComponent(youtubeUrl)}`);
        
        await page.waitForSelector('button[type="submit"]');
        await page.click('button[type="submit"]');
        
        await page.waitForSelector('[data-title="[TXT] English"]', { timeout: 10000 });
        await page.click('[data-title="[TXT] English"]');

        await new Promise(r => setTimeout(r, 3000));

        const files = await fs.readdir(tempDir);
        const subtitleFile = files.find(f => f.endsWith('.txt'));

        if (!subtitleFile) {
            throw new Error('No English subtitles found for this video');
        }

        const subtitles = await fs.readFile(path.join(tempDir, subtitleFile), 'utf-8');
        
        return {
            text: subtitles,
            videoId
        };

    } catch (error) {
        console.error('Error downloading subtitles:', error);
        throw new Error(`Failed to download subtitles: ${error.message}`);
    } finally {
        if (browser) await browser.close();
        await fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);
    }
}