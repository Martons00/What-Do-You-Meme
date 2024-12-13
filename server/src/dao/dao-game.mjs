import { db } from '../db/db.mjs';
import Game from '../components/Game.mjs';

export default function GamesDAO() {

    this.createGame = (username, start_time = new Date(), end_time = null, total_score = 0) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO Games (username, start_time, end_time, total_score) VALUES (?, ?, ?, ?)`;
            db.run(query, [username, start_time, end_time, total_score], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    };

    this.getGameById = (game_id, username) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Games WHERE game_id = ?`;
            db.get(query, [game_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (row.username !== username) {
                        reject(new Error('Unauthorized'));
                    }
                    resolve(row);
                }
            });
        });
    };

    this.getGamesByUserId = (username) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Games WHERE username = ?`;
            db.all(query, [username], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    this.updateGame = (game_id, end_time, total_score) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE Games SET end_time = ?, total_score = ? WHERE game_id = ?`;
            db.run(query, [end_time, total_score, game_id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    this.deleteGame = (game_id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM Games WHERE game_id = ?`;
            db.run(query, [game_id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
}
