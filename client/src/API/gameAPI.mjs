import Game from '../models/Game.mjs';

const SERVER_URL = 'http://localhost:3001/api';


function handleInvalidResponse(response) {
    if (!response.ok) { throw Error(response.statusText) }
    let type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1) {
        throw new TypeError(`Expected JSON, got ${type}`)
    }
    return response;
}

async function getGames(username) {
    const games = await fetch(`${SERVER_URL}/users` + (username ? `?username=${username}/games` : ''), { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiGamesToGames);

    return games;
}

async function getGameById(gameId) {
    const game = await fetch(`${SERVER_URL}/games/${gameId}`, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(game => new Game(game.game_id, game.username, game.total_score, game.start_time, game.end_time));
    return game;
}

async function createGame(username, start_time, end_time, total_score) {
    const game = await fetch(`${SERVER_URL}/games`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, start_time, end_time, total_score })
    })
        .then(handleInvalidResponse)
        .then(response => response.json());

    return game.game_id;
}

async function updateGame(gameId, end_time, total_score) {
    await fetch(`${SERVER_URL}/games/${gameId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ end_time, total_score })
    })
        .then(handleInvalidResponse);
}

async function deleteGame(gameId) {
    await fetch(`${SERVER_URL}/games/${gameId}`, {
        method: 'DELETE',
        credentials: 'include'
    })
        .then(handleInvalidResponse);
}

async function getGamesByUserId(userId) {
    const games = await fetch(`${SERVER_URL}/users/${userId}/games`, { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(mapApiGamesToGames);
    return games;
}

function mapApiGamesToGames(apiGames) {
    return apiGames.map(game => new Game(game.game_id, game.username, game.total_score, game.start_time.split("T")[0], game.end_time.split("T")[0]));
}

const gameAPI = { getGames, getGameById, createGame, updateGame, deleteGame, getGamesByUserId };
export default gameAPI;
