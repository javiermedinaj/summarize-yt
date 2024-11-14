import { getVideoSubtitles } from '../services/subtitle.service.js';
import { summarizeText } from '../services/openai.service.js';
import Joi from 'joi';

const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://summarize-ai-yt.vercel.app/"
];

const videoUrlSchema = Joi.object({
    videoUrl: Joi.string().uri().required()
});

export default async function (context, req) {
    const origin = req.headers.origin;
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    if (req.method === "OPTIONS") {
        context.res = {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Max-Age": "86400"
            }
        };
        return;
    }

    try {
        const { error } = videoUrlSchema.validate(req.body);
        if (error) {
            context.res = {
                status: 400,
                body: { error: error.details[0].message },
                headers: {
                    "Access-Control-Allow-Origin": allowedOrigin,
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type"
                }
            };
            return;
        }

        const { videoUrl } = req.body;
        const subtitles = await getVideoSubtitles(videoUrl);
        const summary = await summarizeText(subtitles.text);
        
        context.res = {
            status: 200,
            body: {
                success: true,
                summary,
                videoId: subtitles.videoId
            },
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        };
    } catch (error) {
    
        context.log.error('Function error:', error);
        context.res = {
            status: 500,
            body: { 
                error: error.message || 'Failed to process video'
            },
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        };
    }
}