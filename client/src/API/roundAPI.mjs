const SERVER_URL = 'http://localhost:3001/api';

import Round from "../models/Round.mjs";

async function getRoundByID(id) {
    const round = await fetch(SERVER_URL + '/rounds/' + id, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiRoundToRound);

    return round;
}

async function getRoundsByGameID(id) {
    const rounds = await fetch(SERVER_URL + '/games/' + id + '/rounds', { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiRoundsToRounds);

    return rounds;
}



async function createRound(game_id, meme_id,username, selectedCaption_id, is_correct, score) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id, meme_id,username, selectedCaption_id, is_correct, score }),
        credentials: 'include'
    };

    const response = await fetch(SERVER_URL + '/rounds', requestOptions);
    if (!response.ok) {
        throw new Error('Failed to create round');
    }
    const data = await response.json();
    return data.round_id;
}

async function updateRound(id, selectedCaption_id, is_correct, score) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedCaption_id, is_correct, score }),
        credentials: 'include'
    };

    const response = await fetch(SERVER_URL + '/rounds/' + id, requestOptions);
    if (!response.ok) {
        throw new Error('Failed to update round');
    }
}

async function deleteRound(id) {
    const requestOptions = {
        method: 'DELETE',
        credentials: 'include'
    };

    const response = await fetch(SERVER_URL + '/rounds/' + id, requestOptions);
    if (!response.ok) {
        throw new Error('Failed to delete round');
    }
}


function handleInvalidResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    let type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1) {
        throw new TypeError(`Expected JSON, got ${type}`);
    }
    return response;
}

function mapApiRoundToRound(apiRound) {
    return new Round(apiRound.round_id, apiRound.game_id, apiRound.meme_id,apiRound.username, apiRound.selectedCaption_id, apiRound.is_correct, apiRound.score);
}
function mapApiRoundsToRounds(apiRounds) {
    return apiRounds.map(round => mapApiRoundToRound(round));
}

const RoundAPI = { getRoundsByGameID, getRoundByID, createRound, updateRound, deleteRound, handleInvalidResponse };
export default RoundAPI;
