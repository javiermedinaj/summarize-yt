import express from 'express';
import { 
    getAllSubtitles, 
    getSubtitleById, 
    getSubtitlesByVideoId, 
    deleteSubtitle 
} from '../services/subtitle.service.js';

const router = express.Router();

// GET /api/subtitles - Obtener todos los subtítulos (últimos 50)
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const subtitles = await getAllSubtitles(limit);
        res.json({ success: true, data: subtitles, count: subtitles.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/subtitles/:id - Obtener subtítulo por ID
router.get('/:id', async (req, res) => {
    try {
        const subtitle = await getSubtitleById(req.params.id);
        if (!subtitle) {
            return res.status(404).json({ success: false, error: 'Subtitle not found' });
        }
        res.json({ success: true, data: subtitle });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/subtitles/video/:videoId - Obtener subtítulos por videoId
router.get('/video/:videoId', async (req, res) => {
    try {
        const subtitles = await getSubtitlesByVideoId(req.params.videoId);
        res.json({ success: true, data: subtitles, count: subtitles.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE /api/subtitles/:id - Eliminar subtítulo
router.delete('/:id', async (req, res) => {
    try {
        const subtitle = await deleteSubtitle(req.params.id);
        if (!subtitle) {
            return res.status(404).json({ success: false, error: 'Subtitle not found' });
        }
        res.json({ success: true, message: 'Subtitle deleted', data: subtitle });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
