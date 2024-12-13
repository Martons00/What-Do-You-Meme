// memeCaptionDao.js

import { db } from '../db/db.mjs';
import MemeCaption from '../components/MemeCaption.mjs'; // Assicurati di avere il percorso corretto

export default function MemeCaptionDao() {

  // Retrieve all meme-caption links from the database
  this.getAllMemeCaptions = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM MemeCaptions';
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const memeCaptions = rows.map(row => new MemeCaption(row.meme_id, row.caption_id));
          resolve(memeCaptions);
        }
      });
    });
  };


  this.getCaptionsByMemeID = (memeId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT caption_id FROM MemeCaptions WHERE meme_id = ?';
      db.all(query, [memeId], async (err, rows) => {
        if (err) {
          reject(err);
        } else {
          try {
            // Ottieni tutti gli ID delle captions associate al memeId
            const captionIds = rows.map(row => row.caption_id);
            resolve(captionIds);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  };

  this.getMemeIdbyCaptionID = (captionId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT meme_id FROM MemeCaptions WHERE caption_id = ?';
      db.all(query, [captionId], async (err, rows) => {
        if (err) {
          reject(err);
        } else {
          try {
            const memeIds = rows.map(row => row.meme_id);
            resolve(memeIds);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  };



}
