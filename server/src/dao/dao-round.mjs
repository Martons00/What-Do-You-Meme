import { db } from '../db/db.mjs';
import Round from '../components/Round.mjs';

export default function RoundDAO() {

    this.createRound = (game_id, meme_id, username, selectedCaption_id, is_correct, score) => {
        return new Promise((resolve, reject) => {
            if (selectedCaption_id == null) {
                selectedCaption_id = 35;
            }
            const query = `INSERT INTO Rounds (game_id, meme_id,username,selectedCaption_id, is_correct, score) VALUES (?, ?,?,?, ?, ?)`;
            db.run(query, [game_id, meme_id, username, selectedCaption_id, is_correct, score], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    };

    this.getRoundById = (round_id, username) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Rounds WHERE round_id = ?`;
            db.get(query, [round_id], (err, row) => {
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

    this.getRoundsByGameId = (game_id) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Rounds WHERE game_id = ?`;
            db.all(query, [game_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    };

    this.updateRound = (round_id, selectedCaption_id, is_correct, score) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE Rounds SET selectedCaption_id = ?,is_correct = ?, score = ? WHERE round_id = ?`;
            db.run(query, [selectedCaption_id, is_correct, score, round_id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

    this.deleteRound = (round_id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM Rounds WHERE round_id = ?`;
            db.run(query, [round_id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };
}
