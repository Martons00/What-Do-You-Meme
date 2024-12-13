import express from 'express';
import passport from 'passport';
import { validationResult } from "express-validator";

const router = express.Router();

// POST /api/sessions
// This route is used for performing login.
router.post('/', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
router.get('/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// DELETE /api/sessions/current
// This route is used for logging out the current user.
router.delete('/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Passa al prossimo middleware se l'utente è autenticato
  }
  return res.status(401).json({ error: "Unauthenticated user", status: 401 }); // Rispondi con errore 401 se l'utente non è autenticato
};

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // Gestione degli altri errori di validazione
    let error = "The parameters are not formatted properly\n\n";
    errors.array().forEach((e) => {
      error += `- Parameter: **${e.param}** - Reason: *${e.msg}* - Location: *${e.location}*\n\n`;
    });
    return res.status(422).json({ error });
  }
  return next()
}

export const validateStartTime = (req, res, next) => {
  const { start_time } = req.body;
  const startTime = new Date(start_time);

  if (!start_time || startTime > new Date()+1) {
      return res.status(422).json({
          error: 'start date must be a future date',
          field: 'start_time'
      });
  }

  next();
};

export const validateEndTime = (req, res, next) => {
  const { end_time } = req.body;
  const endTime = new Date(end_time);

  if (!end_time || endTime > new Date()+1) {
      return res.status(422).json({
          error: 'end date must be a future date',
          field: 'end_time'
      });
  }

  next();
};

export const validateStartBeforeEnd = (req, res, next) => {
  const { start_time, end_time } = req.body;
  const startTime = new Date(start_time);
  const endTime = new Date(end_time);

  if (startTime > endTime) {
      return res.status(422).json({
          error: 'Start time must be before end time',
          fields: ['start_time', 'end_time']
      });
  }
  next();
};

export default router;

