
import { db } from '../db/db.mjs';
import Caption from '../components/Caption.mjs'; // Assicurati di avere il percorso corretto

export default function CaptionDao() {

  // Retrieve all captions from the database
  this.getAllCaptions = () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM Captions WHERE caption_id != 35';
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const captions = rows.map(row => new Caption(row.caption_id, row.text));
          resolve(captions);
        }
      });
    });
  };

  this.getCaptionByMemeId = (memeId) => {
    return new Promise((resolve, reject) => {
      const queryM = 'SELECT * FROM Captions WHERE caption_id != 35';
      const queryMC = 'SELECT caption_id FROM MemeCaptions WHERE meme_id = ?';
      db.all(queryM, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const captions = rows.map(row => new Caption(row.caption_id, row.text));
          db.all(queryMC, [memeId], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              const correctCaptionTotID = rows.map(row => row.caption_id);
              const correctCaptionID = getRandomElements(correctCaptionTotID, 2);
              const correctCaption = captions.filter(element => element.id == correctCaptionID[0] || element.id == correctCaptionID[1]);
              const captions2 = captions.filter(element => element.id !== correctCaptionID[0] && element.id !== correctCaptionID[1]);
              const filteredCaptions = [...getRandomElements(captions2, 5), ...correctCaption];
              resolve(filteredCaptions);
            }
          });
        }
      });
    });
  }

  // Retrieve a caption by its ID
  this.getCaptionById = (captionId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM Captions WHERE caption_id = ?';
      db.get(query, [captionId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const caption = new Caption(row.caption_id, row.text);
          resolve(caption);
        } else {
          resolve(null);
        }
      });
    });
  };
}

function getRandomElements(array, numElements) {
  const result = [];
  const indices = new Set();

  while (indices.size < numElements) {
    const randomIndex = Math.floor(Math.random() * array.length);
    indices.add(randomIndex);
  }

  indices.forEach(index => result.push(array[index]));
  return result;
}
