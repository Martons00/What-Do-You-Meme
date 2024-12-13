import { db } from '../db/db.mjs';
import Meme from '../components/Meme.mjs';

export default function MemeDAO() {

    // This function retrieves the whole list of films from the database.
    this.getAllMemes = () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Memes';
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const memes = mapRowsToMemes(rows);

                    resolve(memes);
                }
            });
        });
    };

    this.getRandomMeme = (meme1Id, meme2Id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Memes';
            db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let memes = mapRowsToMemes(rows);
                    if (meme1Id !== null) {
                        memes = memes.filter(element => element.id !== meme1Id);
                    }
                    if (meme2Id !== null) {
                        memes = memes.filter(element => element.id !== meme2Id);
                    }
                    const meme = 
                    resolve(memes[Math.floor(Math.random() * memes.length)]);
                }
            });

        });
    };

    this.getMemeById = (meme_id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Memes WHERE meme_id = ?';
            db.get(query, [meme_id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    const meme = new Meme(row.meme_id, row.image_url, row.title);
                    resolve(meme);
                } else {
                    resolve(null);
                }
            });
        });
    };

    function mapRowsToMemes(rows) {
        // Note: the parameters must follow the same order specified in the constructor.
        return rows.map(row => new Meme(row.meme_id, row.image_url, row.title));
    }
}


