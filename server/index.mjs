/*** Importing modules ***/
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import UserDao from "./src/dao/dao-users.mjs"; // module for accessing the users table in the DB
import memesRouter from './src/routes/memeRoutes.mjs'; // module for meme-related routes
import captionsRouter from './src/routes/captionRoutes.mjs'; // module for caption-related routes
import memeCaptionsRouter from './src/routes/memeCaptionsRoutes.mjs'; // module for meme-caption-related routes
import gameRouter from './src/routes/gameRoutes.mjs'; // module for game-related routes
import roundRouter from './src/routes/roundRoutes.mjs'; // module for round-related routes 
import authRouter from './src/routes/authRoutes.mjs'; // module for authentication-related routes
import userRouter from './src/routes/userRoutes.mjs'; // module for user-related routes
const userDao = new UserDao();

/*** init express and set up the middlewares ***/
const app = express();
app.use(morgan('dev'));
app.use(express.json());


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
import passport from 'passport';                              // authentication middleware
import LocalStrategy from 'passport-local';                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUserByCredentials() (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUserByCredentials(username, password)
    if(!user)
      return callback(null, false, 'Incorrect username or password');

    return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUserByCredentials(), i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name
    callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name
    return callback(null, user); // this will be available in req.user

    // In this method, if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
    // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));
});



/** Creating the session */
import session from 'express-session';
import e from 'express';

app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}

/*** Utility Functions ***/
app.use('/api/memes', memesRouter);
app.use('/api/captions', captionsRouter);
app.use('/api/meme-captions', memeCaptionsRouter);
app.use('/api/games', gameRouter);
app.use('/api/rounds', roundRouter);
app.use('/api/sessions/', authRouter);
app.use('/api/users/', userRouter);
// This function is used to handle validation errors
const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    return res.status(422).json({validationErrors: errors.mapped()});
};

// Only keep the error message in the response
const errorFormatter = ({msg}) => {
    return msg;
};


// Activating the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

export default app;
