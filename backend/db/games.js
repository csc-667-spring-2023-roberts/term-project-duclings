const db = require("./connection.js");

const checkPropertyInfo = async () => {
  console.log("Checking if property info is correct...");
  const { rows } = await db.query("SELECT COUNT(*) FROM property_info");
  const rowCount = parseInt(rows[0].count);

  if (rowCount === 0) {
    // Read the property data from the JSON file
    const properties = JSON.parse(fs.readFileSync("properties.json"));
    // Insert the property data into the database
    for (const property of properties) {
      const query = {
        text: `INSERT INTO property_info
           (board_position, property_color, property_cost, mortgage_payout, unmortgage_cost, payout_base,
            house_cost_1, house_cost_2, house_cost_3, house_cost_4, hotel_cost,
            payout_house_1, payout_house_2, payout_house_3, payout_house_4, payout_hotel)
           VALUES
           ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        values: [
          property.board_position,
          property.property_color,
          property.property_cost,
          property.mortgage_payout,
          property.unmortgage_cost,
          property.payout_base,
          property.house_cost_1,
          property.house_cost_2,
          property.house_cost_3,
          property.house_cost_4,
          property.hotel_cost,
          property.payout_house_1,
          property.payout_house_2,
          property.payout_house_3,
          property.payout_house_4,
          property.payout_hotel,
        ],
      };
      await db.query(query);
    }
  } else {
    console.log("property_info table is already populated");
  }
};

const CREATE_GAME_SQL =
  "INSERT INTO games (completed) VALUES (false) RETURNING *";
const INSERT_FIRST_USER_SQL =
  "INSERT INTO game_users (user_id, game_id, current_player) VALUES ($1, $2, true)";

const create = async (creator_id) => {
  checkPropertyInfo();
  // Creates game instance for this game (in the database in the games table)
  const { id } = await db.one(CREATE_GAME_SQL);

  // Insert creator of the game into the game (into the games_users column of the game row)
  await db.none(INSERT_FIRST_USER_SQL, [creator_id, id]);

  // Game board gets set up here:
  const board = [];

  // Inserts the board into the database after filling it with empty moves
  await Promise.all(board.map((query) => db.none(query, [id])));

  // Returns the game id
  return { id };
};

const getGame = async (user_id) =>
  db.one("SELECT game_id FROM games_users WHERE user_id=$1", [user_id]);

const GAMES_LIST_SQL = `SELECT * FROM games;`;
const list = async (user_id) => db.any(GAMES_LIST_SQL, [user_id]);

const JOIN_GAME_SQL =
  "INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)";
const join = (game_id, user_id) => db.none(JOIN_GAME_SQL, [game_id, user_id]);

const END_GAME_SQL = `DELETE FROM games WHERE id=$1`;
const endGame = (game_id) => db.none(END_GAME_SQL, [game_id]);

// Create and return the game state
const state = async (game_id, user_id) => {
  // Dealing with the game_users table
  const users = await db.many(
    "SELECT users.username, users.id AS user_id FROM users, game_users WHERE users.id=game_users.user_id AND game_users.game_id=$1 ORDER BY game_users.created_at",
    [game_id]
  );

  return {
    game_id,
    users,
    user_id,
  };
};

module.exports = { create, list, join, endGame, getGame, state };
