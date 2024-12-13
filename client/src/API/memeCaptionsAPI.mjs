import MemeCaption from '../models/MemeCaption.mjs';
import Caption from '../models/Caption.mjs';


const SERVER_URL = 'http://localhost:3001/api';

async function handleInvalidResponse(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Errore nella risposta del server');
    }
    return response;
}

async function getAllMemeCaptions() {
    const memeCaptions = await fetch(`${SERVER_URL}/meme-captions`, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiMemeCaptionsToMemeCaptions);

    return memeCaptions;
}

async function getCaptionsByMemeId(memeId) {
    const memeCaptions = await fetch(`${SERVER_URL}/meme-captions/meme/${memeId}`, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiCaptionsToCaptions);

    return memeCaptions;
}

async function getMemeIdbyCaptionId(captionId) {
    const memeId = await fetch(`${SERVER_URL}/meme-captions/meme/${captionId}`, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())

    return memeId;
}

function mapApiMemeCaptionsToMemeCaptions(apiMemeCaptions) {
    return apiMemeCaptions.map(mc => new MemeCaption(mc.memeId, mc.captionId));
}
function mapApiCaptionsToCaptions(apiCaptions) {
    return apiCaptions.map(caption => new Caption(caption.id, caption.text));
}
const MemeCaptionAPI = { getAllMemeCaptions, getCaptionsByMemeId, getMemeIdbyCaptionId };
export default MemeCaptionAPI;
