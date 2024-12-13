/* Data Access Object (DAO) module for accessing users data */

import { db } from "../db/db.mjs";
import crypto from "crypto";

// NOTE: all functions return error messages as json object { error: <string> }
export default function UserDao() {

    this.createUser = (username, password) => {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16).toString('hex');
            crypto.scrypt(password, salt, 32, (err, derivedKey) => {
                if (err) {
                    reject(err);
                } else {
                    const hashed_password = derivedKey.toString('hex');
                    const query = 'INSERT INTO Users (username, hashed_password, salt) VALUES (?, ?, ?)';
                    db.run(query, [username, hashed_password, salt], function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ id: this.lastID, username });
                        }
                    });
                }
            });
        });
    };

    // This function retrieves one user by id
    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE id=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({ error: 'User not found.' });
                } else {
                    resolve(row);
                }
            });
        });
    };

    this.getUserByCredentials = (username, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username=?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const user = { id: row.id, username: row.username };

                    // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
                    crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { // WARN: it is 64 and not 32 (as in the week example) in the DB
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.hashed_password, 'hex'), hashedPassword)) // WARN: it is hash and not password (as in the week example) in the DB
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }

}
