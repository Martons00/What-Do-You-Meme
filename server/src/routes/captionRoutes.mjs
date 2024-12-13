import express from 'express';
import CaptionDao from '../dao/dao-caption.mjs';

const router = express.Router();
const captionDao = new CaptionDao();



// GET /api/captions
router.get('/', async (req, res) => {
    try {
        const captions = await captionDao.getAllCaptions();
        res.json(captions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch captions' });
    }
});

// GET /api/captions
router.get('/meme/:id', async (req, res) => {
    const memeId = req.params.id;
    try {
        const captions = await captionDao.getCaptionByMemeId(memeId);
        res.json(captions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch captions' });
    }
});

// GET /api/captions/:id
router.get('/:id', async (req, res) => {
    const captionId = req.params.id;
    try {
        const caption = await captionDao.getCaptionById(captionId);
        if (!caption) {
            return res.status(404).json({ error: 'Caption not found' });
        }
        res.json(caption);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch caption' });
    }
});


export default router;
