import express from 'express';
import MemeCaptionDao from '../dao/dao-memeCaptions.mjs';
import CaptionDao from '../dao/dao-caption.mjs';

const router = express.Router();
const memeCaptionDao = new MemeCaptionDao();
const captionDao = new CaptionDao();



// GET /api/meme-captions
router.get('/', async (req, res) => {
    try {
        const memeCaptions = await memeCaptionDao.getAllMemeCaptions();
        res.json(memeCaptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch meme-caption links' });
    }
});

router.get('/meme/:meme_id', async (req, res) => {
    const memeId = req.params.meme_id;
    try {
        const captionID = await memeCaptionDao.getCaptionsByMemeID(memeId);

        // Ottieni le captions corrispondenti agli ID ottenuti
        const captions = await Promise.all(captionID.map(async (captionId) => {
            try {
                const caption = await captionDao.getCaptionById(captionId);
                return caption;
            } catch (error) {
                throw new Error(`Errore durante il recupero della caption con ID ${captionId}: ${error.message}`);
            }
        }));

        res.json(captions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch meme-caption links' });
    }
});

router.get('/:caption_id', async (req, res) => {
    const captionId = req.params.caption_id;
    try {
        const memeid = await memeCaptionDao.getMemeIdbyCaptionID(captionId);
        res.json(memeid);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch meme-caption links' });
    }
});



export default router;
