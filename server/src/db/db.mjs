/** DB access module **/

import sqlite3 from "sqlite3";

// Opening the database
// NOTE: to work properly you must run the server inside "server" folder (i.e., ./solution/server)
const database_path = './src/db/' // './solution/server/'
const db = new sqlite3.Database(database_path + 'db.sqlite', (err) => {
    if (err) throw err;
    console.log("Database connected successfully");
});
const files = [
    { filename: 'Baby-Running.jpg', title: 'Baby Running' },
    { filename: 'Bike-Fall.jpg', title: 'Bike Fall' },
    { filename: 'Blank-Nut-Button.jpg', title: 'Blank Nut Button' },
    { filename: 'Change-My-Mind.jpg', title: 'Change My Mind' },
    { filename: 'Clown.jpg', title: 'Clown' },
    { filename: 'Di-Lorenzo.jpg', title: 'Di Lorenzo' },
    { filename: 'Disaster-Girl.jpg', title: 'Disaster Girl' },
    { filename: 'Headaches.jpg', title: 'Headaches' },
    { filename: 'Laughing-Leo.jpg', title: 'Laughing Leo' },
    { filename: 'Mertens.jpg', title: 'Mertens' },
    { filename: 'Mom-Ignoring-Kid.jpg', title: 'Mom Ignoring Kid' },
    { filename: 'Sad-Pablo-Escobar.jpg', title: 'Sad Pablo Escobar' },
    { filename: 'SadHamster.jpg', title: 'Sad Hamster' },
    { filename: 'This-Is-Fine.jpg', title: 'This Is Fine' },
    { filename: 'UNO-Draw-25-Cards.jpg', title: 'UNO Draw 25 Cards' },
    { filename: 'Via-Brombeis.jpg', title: 'Via Brombeis' },
    { filename: 'Biden.jpg', title: 'Biden' }
];

const captionsToInsert = [
    'Me running away from the communists with flyers.',
    'When they give out gadgets at the Job Day.',
    'When the session is far away but you still think about it.',
    'Now I’m signing up for this exam.',
    'Skip the ad.',
    'Fire emoji in DMs.',
    'Taylor Swift is overrated.',
    'Video lessons should be mandatory.',
    'Today I feel like studying.',
    'A Venetian.',
    'My grandmother’s Christmas gift.',
    '3 months left until Christmas holidays.',
    'Being 20 during Covid.',
    'Living in Barriera di Milano.',
    'Listening to Salvini.',
    'Mosquitoes in July.',
    '(Freshmen) After Calculus 1, it’s all downhill.',
    'Me at the pandoro-gate.',
    'Erasmus night.',
    'Vacation in Rimini.',
    'Web App Project VS ML Project.',
    'Forwards VS Goalkeepers VS Defenders.',
    'Waiting for the professor’s grade report.',
    'Waiting for the scholarship.',
    'Lord of exercises, how do you do a div?',
    'Lord of muscles, how do you do that thing where you lower your arms like this?',
    'One week until the session.',
    'Turin in August.',
    'Stop scrolling TikTok or ...',
    'Stop saying LESGOSKY or ...',
    'Where the hell is Via Brombeis?',
    'I’ve never been to Naples.',
    'President, what future do you envision for the young? President, President?',
    'English or Spanish?',
    'You didn’t choose a caption.',
    'That moment you realize you’ve been on mute the entire meeting.',
    'When your favorite song comes on and you’re in public.',
    'Trying to act cool while your crush walks by.',
    'When you finally understand a math problem after 20 minutes.',
    'Realizing it’s Friday and the weekend is near.',
    'When you see someone from your high school at the grocery store.',
    'Trying to look busy when your boss walks by.',
    'When your pet does something hilarious but no one’s around to see it.',
    'Finding money in a jacket you haven’t worn in months.',
    'When you nail a recipe on the first try.',
    'Trying to stay awake during a boring lecture.',
    'When your WiFi goes down during a crucial moment.',
    'Sneaking snacks into the movie theater like a pro.',
    'Realizing you left your phone at home halfway to work.',
    'When you finish a workout and feel like you can conquer the world.'
];


const memeCaptionsToInsert = [
    '(1, 1)', '(1, 2)', '(2, 3)', '(2, 4)', '(3, 5)',
    '(3, 6)', '(4, 7)', '(4, 8)', '(5, 9)', '(5, 10)',
    '(6, 11)', '(6, 12)', '(7, 13)', '(7, 14)', '(8, 15)',
    '(8, 16)', '(9, 17)', '(9, 18)', '(10, 19)', '(10, 20)',
    '(11, 21)', '(11, 22)', '(12, 23)', '(12, 24)', '(13, 25)',
    '(13, 26)', '(14, 27)', '(14, 28)', '(15, 29)', '(15, 30)',
    '(16, 31)', '(16, 32)', '(17, 33)', '(17, 34)'
];



// Costruisci la query di inserimento
const insertQueryC = `
    INSERT INTO Captions (text) VALUES
        ${captionsToInsert.map(caption => `('${caption}')`).join(',\n        ')};
`;

// Costruisci la query di inserimento
const insertQueryMC = `
    INSERT INTO MemeCaptions (meme_id, caption_id) VALUES
        ${memeCaptionsToInsert.join(',\n        ')};
`;

// Function to create tables
const createTables = (db) => {
    db.serialize(() => {

        db.run(`
            CREATE TABLE IF NOT EXISTS Users (
                username VARCHAR(50) PRIMARY KEY NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                salt VARCHAR(16) NOT NULL
            );
        `);

        db.run(`
        CREATE TABLE IF NOT EXISTS Memes (
            meme_id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT NOT NULL,
            title TEXT NOT NULL
        ) `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Captions (
                caption_id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT NOT NULL
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS MemeCaptions (
                meme_id INTEGER NOT NULL,
                caption_id INTEGER NOT NULL,
                PRIMARY KEY (meme_id, caption_id),
                FOREIGN KEY (meme_id) REFERENCES Memes(meme_id) ON DELETE CASCADE,
                FOREIGN KEY (caption_id) REFERENCES Captions(caption_id) ON DELETE CASCADE
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Games (
                game_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50),
                start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                end_time TIMESTAMP,
                total_score INTEGER DEFAULT 0,
                FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Rounds (
            round_id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER NOT NULL,
            meme_id INTEGER NOT NULL,
            username VARCHAR(50),
            selectedCaption_id INTEGER NOT NULL,
            is_correct BOOLEAN NOT NULL,
            score INTEGER NOT NULL,
            FOREIGN KEY (game_id) REFERENCES Games(game_id) ON DELETE CASCADE,
            FOREIGN KEY (meme_id) REFERENCES Memes(meme_id) ON DELETE CASCADE
            );
        `);

        db.run(`
        CREATE TRIGGER IF NOT EXISTS delete_rounds_after_game_delete
        BEFORE DELETE ON Games
        FOR EACH ROW
        BEGIN
            DELETE FROM Rounds WHERE game_id = OLD.game_id;
        END;
    `, (err) => {
            if (err) {
                console.error('Could not create trigger:', err.message);
            } else {
                console.log('Trigger created successfully');
            }
        });





        console.log("Tables created successfully");
    });
};


const popolateTables = (db) => {
    db.serialize(() => {

        // Inserimento dei dati
        const insertStatement = db.prepare('INSERT INTO Memes (image_url, title) VALUES (?, ?)');
        files.forEach(file => {
            insertStatement.run(file.filename, file.title, (err) => {
                if (err) {
                    console.error(`Errore durante l'inserimento del meme ${file.filename}:`, err.message);
                } else {
                    console.log(`Meme ${file.filename} inserito con successo.`);
                }
            });
        });
        insertStatement.finalize(); // Finalizza il prepared statement dopo l'inserimento

        // Inserimento di dati nella tabella Captions
        db.run(insertQueryC, function (err) {
            if (err) {
                console.log("Errore durante l'inserimento delle captions:", err.message);
            } else {
                console.log("Inserimento delle captions completato con successo.");
            }
        });

        // Esegui la query usando db.run
        db.run(insertQueryMC, function (err) {
            if (err) {
                console.log("Errore durante l'inserimento delle MemeCaptions:", err.message);
            } else {
                console.log("Inserimento delle MemeCaptions completato con successo.");
            }
        });

        console.log("Inserimenti completati");
    });
};


// Exporting the database connection and the createTables function
export { db, createTables };

// Automatically create tables when the module is loaded
createTables(db);
//popolateTables(db);

