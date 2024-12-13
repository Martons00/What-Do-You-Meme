
import express from 'express';
import MemeDAO from '../dao/dao-memes.mjs'; // Assicurati che il percorso sia corretto in base alla tua struttura dei file

const memeDAO = new MemeDAO();
const router = express.Router();


// GET /api/memes
router.get('/', async (req, res) => {
    try {
        const memes = await memeDAO.getAllMemes();
        res.json(memes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch memes' });
    }
});


router.get('/random/:ids', async (req, res) => {
    const [meme1Id, meme2Id] = req.params.ids.split('-');
    try {
        const meme = await memeDAO.getRandomMeme(meme1Id, meme2Id);
        res.json(meme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch meme' });
    }
});

// GET /api/memes/:id
router.get('/:id', async (req, res) => {
    const memeId = req.params.id;
    try {
        const meme = await memeDAO.getMemeById(memeId);
        if (!meme) {
            return res.status(404).json({ error: 'Meme not found' });
        }
        res.json(meme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch meme' });
    }
});





export default router;
