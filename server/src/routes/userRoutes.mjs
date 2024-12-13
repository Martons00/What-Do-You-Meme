import express from 'express';
import UserDao from '../dao/dao-users.mjs';
import GamesDAO from '../dao/dao-game.mjs';
import { isLoggedIn, validateRequest } from './authRoutes.mjs';
import { body } from "express-validator"
import passport from 'passport';
import crypto from 'crypto';

const router = express.Router();
const userDao = new UserDao();
const gamesDao = new GamesDAO();

// POST /api/users
// This route is used for creating a new user.
router.post('/',
    body("username").isString().notEmpty().withMessage('username must be a non-empty string'),
    body("password").isString().notEmpty().withMessage('password must be a non-empty string'),
    validateRequest
    , async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await userDao.createUser(username, password);
            res.status(201).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    });
// Ottieni tutti i games per user_id
router.get('/:user_id/games',
    isLoggedIn,
    validateRequest
    , async (req, res) => {
        const { user_id } = req.params;
        try {
            const games = await gamesDao.getGamesByUserId(user_id);
            res.json(games);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


export default router;
