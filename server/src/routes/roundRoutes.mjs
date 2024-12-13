import express from 'express';
import RoundDAO from '../dao/dao-round.mjs'; // Importa il DAO per Round
import { isLoggedIn, validateRequest } from './authRoutes.mjs';
import { body } from "express-validator"

const router = express.Router();
const roundsDAO = new RoundDAO();

// Crea un nuovo round
router.post('/',
    body("game_id").isInt().notEmpty().withMessage('game_id must be a non-empty integer'),
    body("meme_id").isInt().notEmpty().withMessage('meme_id must be a non-empty integer'),
    body("username").isString().notEmpty().withMessage('username must be a non-empty string'),
    body("is_correct").isBoolean().notEmpty().withMessage('is_correct must be a non-empty boolean'),
    body("score").isInt().notEmpty().withMessage('score must be a non-empty integer'),
    validateRequest,
    isLoggedIn
    , async (req, res) => {
        if (req.user.username !== req.body.username) {
            res.status(403).json({ error: 'Forbidden' });
        }
        const { game_id, meme_id,username, selectedCaption_id, is_correct, score } = req.body;
        try {
            const round_id = await roundsDAO.createRound(game_id, meme_id,username, selectedCaption_id, is_correct, score);
            res.status(201).json({ round_id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

// Ottieni un round per ID
router.get('/:id', 
    isLoggedIn
    ,async (req, res) => {
    const { id } = req.params;
    try {
        const round = await roundsDAO.getRoundById(Number(id),req.user.username);
        if (round) {
            res.json(round);
        } else {
            res.status(404).json({ error: 'Round not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





// Aggiorna un round
router.put('/:id',
    body("selectedCaption_id").isInt().notEmpty().withMessage('selectedCaption_id must be a non-empty integer'),
    body("is_correct").isBoolean().notEmpty().withMessage('is_correct must be a non-empty boolean'),
    body("score").isInt().notEmpty().withMessage('score must be a non-empty integer'),
    validateRequest,
    isLoggedIn
    , async (req, res) => {
        const { id } = req.params;
        const { selectedCaption_id, is_correct, score } = req.body;
        try {
            await roundsDAO.updateRound(Number(id), selectedCaption_id, is_correct, score);
            res.status(204).end();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

// Elimina un round
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await roundsDAO.deleteRound(Number(id));
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
