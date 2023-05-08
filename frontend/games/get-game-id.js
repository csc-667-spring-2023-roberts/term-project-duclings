/**
 *
 * @param {String} location
 */

// Grabs the game id from list of available games
export function getGameId(location) {
  const gameId = location.substring(location.lastIndexOf("/") + 1);

  // If the game id is "lobby", then it's the lobby page, otherwise it's a game
  if (gameId === "lobby") {
    return 0;
  } else {
    return parseInt(gameId);
  }
}
