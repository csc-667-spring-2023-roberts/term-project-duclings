const db = require("./connection.js");

const CREATE_GAME_SQL =
  "INSERT INTO games (completed) VALUES (false) RETURNING *";
const INSERT_FIRST_USER_SQL =
  "INSERT INTO game_users (user_id, game_id, current_player) VALUES ($1, $2, true)";

const create = async (creator_id) => {
  // Creates game instance for this game (in the database in the games table)
  const { id } = await db.one(CREATE_GAME_SQL);

  // Insert creator of the game into the game (into the games_users column of the game row)
  await db.none(INSERT_FIRST_USER_SQL, [creator_id, id]);

  // Game board gets set up here:
  // In his tic-tac-toe example, he used a for loop to iterate through the board and insert each cell as an empty move (set to zero, aka not a user) into the database
  const board = [];
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      board.push(
        `INSERT INTO game_moves (game_id, user_id, x_coordinate, y_coordinate) VALUES ($1, 0, ${row}, ${column})`
      );
    }
  }

  // Inserts the board into the database after filling it with empty moves
  await Promise.all(board.map((query) => db.none(query, [id])));

  // Returns the game id
  return { id };
};

// const GAMES_LIST_SQL = `
//   SELECT g.id, g.created_at FROM games g, game_users gu
//   WHERE g.id=gu.game_id AND gu.user_id != $1 AND
//   (SELECT COUNT(*) FROM game_users WHERE game_users.game_id=g.id) = 1
// `;

const GAMES_LIST_SQL = `
  SELECT * FROM games;
`;

const list = async (user_id) => db.any(GAMES_LIST_SQL, [user_id]);

const JOIN_GAME_SQL =
  "INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)";

const join = (game_id, user_id) => db.none(JOIN_GAME_SQL, [game_id, user_id]);

const state = async (game_id, user_id) => {
  const users = await db.many(
    "SELECT users.username, users.id AS user_id FROM users, game_users WHERE users.id=game_users.user_id AND game_users.game_id=$1 ORDER BY game_users.created_at",
    [game_id]
  );
  users[0].letter = "X";
  users[1].letter = "Y";

  const board = await db.many(
    "SELECT user_id, x_coordinate, y_coordinate FROM game_moves WHERE game_id=$1",
    [game_id]
  );

  return {
    game_id,
    users,
    user_id,
    board,
  };
};

const isMoveValid = async (game_id, user_id, x, y) => {
  await db.one(
    "SELECT * FROM game_users WHERE game_users.game_id=$1 AND game_users.user_id=$2 AND current_player=true",
    [game_id, user_id]
  );

  await db.one(
    "SELECT * FROM game_moves WHERE game_moves.game_id=$1 AND game_moves.user_id=0 AND x_coordinate=$2 AND y_coordinate=$3",
    [game_id, x, y]
  );

  await db.none(
    "UPDATE game_moves SET user_id=$1 WHERE game_id=$2 AND x_coordinate=$3 AND y_coordinate=$4",
    [user_id, game_id, x, y]
  );

  return await state(game_id, user_id);
};

module.exports = { create, list, join, state, isMoveValid };
