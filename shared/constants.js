const GAME_CREATED = "game:created";
const GAME_UPDATED = (id) => `game:${id}:updated`;
const GAME_JOINED = `game:joined`;

module.exports = { GAME_CREATED, GAME_UPDATED, GAME_JOINED };
