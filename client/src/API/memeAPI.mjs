const SERVER_URL = 'http://localhost:3001/api';
import Meme from "../models/Meme.mjs";

async function getMemes() {
  const memes = await fetch(SERVER_URL + '/memes', { credentials: 'include' })
    .then(handleInvalidResponse)
    .then(response => response.json())
    .then(mapApiMemesToMemes);

  return memes;
}

async function getRandomMeme(meme1Id, meme2Id) {
  const memeID1 = meme1Id ? meme1Id : 0;
  const memeID2 = meme2Id ? meme2Id : 0;
    const meme =  await fetch(SERVER_URL + '/memes/random' + '/' + memeID1 + '-' + memeID2, { credentials: 'include' })
    .then(handleInvalidResponse)
    .then(response => response.json())
    .then(mapApiMemeToMeme);

    return meme;
}

async function getMemeByID(id) {
  const meme = await fetch(SERVER_URL + '/memes/' + id, { credentials: 'include' })
    .then(handleInvalidResponse)
    .then(response => response.json())
    .then(mapApiMemeToMeme);

  return meme;
}

function mapApiMemeToMeme(apiMeme) {
  return new Meme(apiMeme.id, apiMeme.imageUrl, apiMeme.title);
}

function mapApiMemesToMemes(apiMemes) {
  return apiMemes.map(meme => new Meme(meme.id, meme.imageUrl, meme.title));
}

function handleInvalidResponse(response) {
  if (!response.ok) { throw Error(response.statusText) }
  let type = response.headers.get('Content-Type');
  if (type !== null && type.indexOf('application/json') === -1) {
    throw new TypeError(`Expected JSON, got ${type}`)
  }
  return response;
}



const MemeAPI = { getMemes, getMemeByID, getRandomMeme, handleInvalidResponse };
export default MemeAPI;