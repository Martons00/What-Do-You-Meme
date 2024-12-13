import express from 'express';
import GamesDAO from '../dao/dao-game.mjs';
import RoundsDAO from '../dao/dao-round.mjs';
import { isLoggedIn, validateRequest ,validateStartTime,validateEndTime,validateStartBeforeEnd} from './authRoutes.mjs';
import { body } from "express-validator"

const router = express.Router();
const gamesDAO = new GamesDAO();
const roundsDAO = new RoundsDAO();

// Crea un nuovo game
router.post('/',
    body("username").isString().notEmpty().withMessage('Username must be a non-empty string'),
    body("start_time").isISO8601({ strict: true }).withMessage('start_time must be a valid ISO8601 date (YYYY-MM-DDTHH:mm:ss.sssZ)'),
    body("end_time").isISO8601({ strict: true }).withMessage('end_time must be a valid ISO8601 date (YYYY-MM-DDTHH:mm:ss.sssZ)'),
    body("total_score").isInt().notEmpty().withMessage('total_score must be a non-empty integer'),
    validateEndTime,
    validateStartTime,
    validateStartBeforeEnd,
    isLoggedIn,
    validateRequest
    , async (req, res) => {
        if (req.user.username !== req.body.username) {
            res.status(403).json({ error: 'Forbidden' });
        }
        const { username, start_time, end_time, total_score } = req.body;
        try {
            const game_id = await gamesDAO.createGame(username, start_time, end_time, total_score);
            res.status(201).json({ game_id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });



// Ottieni tutti i round per game_id
router.get('/:game_id/rounds',
    isLoggedIn
    , async (req, res) => {
        const { game_id } = req.params;
        try {
            const rounds = await roundsDAO.getRoundsByGameId(Number(game_id));
            res.json(rounds);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

// Ottieni un game per ID
router.get('/:id',
    isLoggedIn
    , async (req, res) => {
        const { id } = req.params;
        try {
            const game = await gamesDAO.getGameById(Number(id), req.user.username);
            if (game) {
                res.json(game);
            } else {
                res.status(404).json({ error: 'Game not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });



// Aggiorna un game
router.put('/:id',
    body("end_time").isISO8601({ strict: true }).withMessage('Arrival date must be a valid ISO8601 date (YYYY-MM-DDTHH:mm:ss.sssZ)'),
    body("total_score").isInt().notEmpty().withMessage('total_score must be a non-empty integer'),
    isLoggedIn,
    validateEndTime,
    validateRequest
    , async (req, res) => {
        const { id } = req.params;
        const { end_time, total_score } = req.body;
        try {
            await gamesDAO.updateGame(Number(id), end_time, total_score);
            res.status(204).end();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

// Elimina un game
router.delete('/:id',
    isLoggedIn
    , async (req, res) => {
        const { id } = req.params;
        try {
            await gamesDAO.deleteGame(Number(id));
            res.status(204).end();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


export default router;
