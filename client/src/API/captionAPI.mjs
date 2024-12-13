import Caption from '../models/Caption.mjs';

const SERVER_URL = 'http://localhost:3001/api';

async function handleInvalidResponse(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Errore nella risposta del server');
    }
    return response;
}

async function getCaptions() {
    const captions = await fetch(`${SERVER_URL}/captions`, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiCaptionsToCaptions);

    return captions;
}

async function getCaptionById(captionId) {
    const caption = await fetch(`${SERVER_URL}/captions/${captionId}`, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(data => new Caption(data.id, data.text));

    return caption;
}

async function getCaptionForMemeId(memeId) {
    const caption = await fetch(`${SERVER_URL}/captions/meme/${memeId}`, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiCaptionsToCaptions);

    return caption;
}

function mapApiCaptionsToCaptions(apiCaptions) {
    return apiCaptions.map(caption => new Caption(caption.id, caption.text));
}
const captionAPI = { getCaptions, getCaptionById ,getCaptionForMemeId };

export default captionAPI;
