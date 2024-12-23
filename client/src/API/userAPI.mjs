const SERVER_URL = 'http://localhost:3001/api';

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (credentials) => {
  return await fetch(SERVER_URL + '/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared. It is included in all the authenticated APIs.
    body: JSON.stringify(credentials),
  }).then(handleInvalidResponse)
    .then(response => response.json());
};

/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
const register = async (credentials) => {
  return await fetch(SERVER_URL + '/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared. It is included in all the authenticated APIs.
    body: JSON.stringify(credentials),
  }).then(handleInvalidResponse)
    .then(response => response.json());
};

/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
  return await fetch(SERVER_URL + '/sessions/current', {
    credentials: 'include'
  }).then(handleInvalidResponse)
    .then(response => response.json());
};

/**
 * This function destroy the current user's session (executing the log-out).
 */
const logOut = async () => {
  return await fetch(SERVER_URL + '/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  }).then(handleInvalidResponse);
}

function handleInvalidResponse(response) {
  if (!response.ok) { throw Error(response.statusText) }
  let type = response.headers.get('Content-Type');
  if (type !== null && type.indexOf('application/json') === -1) {
    throw new TypeError(`Expected JSON, got ${type}`)
  }
  return response;
}


const UserAPI = { logIn, getUserInfo, logOut, handleInvalidResponse, register };
export default UserAPI;


