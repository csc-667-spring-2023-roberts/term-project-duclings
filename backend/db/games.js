const db = require("./connection.js");
const fs = require("fs");

// Ensures the property_info table is populated. Otherwise, no game can be played properly
const checkPropertyInfo = async () => {
  console.log("Checking if property info is correct...");
  const rows = await db.any("SELECT * FROM property_info");

  const rowCount = rows.length;

  if (rowCount === 0) {
    const propertiesPath = __dirname + "/properties.json";
    // Read the property data from the JSON file
    const properties = JSON.parse(fs.readFileSync(propertiesPath));
    // Insert the property data into the database
    for (const property of properties) {
      const query = {
        text: `INSERT INTO property_info
           (board_position, property_name, property_color, property_cost, mortgage_payout, unmortgage_cost, payout_base,
            house_cost_1, house_cost_2, house_cost_3, house_cost_4, hotel_cost,
            payout_house_1, payout_house_2, payout_house_3, payout_house_4, payout_hotel)
           VALUES
           ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        values: [
          property.board_position,
          property.property_name,
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

// Checks if player is already in a game so they can't create or join another one
const checkIfInAGame = async (user_id) => {
  console.log("Checking if player is in a game...");
  try {
    const result = await db.oneOrNone(
      "SELECT * FROM game_users WHERE user_id=$1",
      [user_id]
    );
    if (result !== null && result !== undefined) {
      return true; // If player is in game
    } else {
      return false; // If no rows returned
    }
  } catch (error) {
    console.log(error);
    return false; // If error occurred
  }
};

const create = async (creator_id) => {
  /* // Save this for later ...
  if (checkIfInAGame(creator_id)) {
    throw new Error("Error thrown: Player is already in a game");
  }
  */
  checkPropertyInfo(); // Checks if property_info table is populated. If not, populates it so users can play the game

  const CREATE_GAME_SQL =
    "INSERT INTO games (completed) VALUES (false) RETURNING *";
  const INSERT_FIRST_USER_SQL =
    "INSERT INTO game_users (user_id, game_id, current_player, play_order) VALUES ($1, $2, true, 1)";

  const INSERT_INVENTORY_SQL =
    "INSERT INTO inventory (user_id, game_id) VALUES ($1, $2)";
  const INSERT_PROPERTY_INV_SQL =
    "INSERT INTO property_inventory (user_id, game_id) VALUES ($1, $2)";
  const { id } = await db.one(CREATE_GAME_SQL); // Creates game instance for this game (in the database in the games table)
  await db.none(INSERT_FIRST_USER_SQL, [creator_id, id]); // Insert creator of the game into the game (into the game_users column of the game row)
  await db.none(INSERT_INVENTORY_SQL, [creator_id, id]);
  await db.none(INSERT_PROPERTY_INV_SQL, [creator_id, id]);
  //const board = []; // Game board gets set up here
  //await Promise.all(board.map((query) => db.none(query, [id]))); // Inserts the board into the database after filling it with empty moves

  return { id }; // Returns the game id
};

const getGame = async (user_id) => {
  console.log("Getting game ID...");
  console.log(user_id);
  const game_id = await db.one(
    "SELECT game_id FROM game_users WHERE user_id=$1",
    [user_id]
  );
  console.log(parseInt(game_id.game_id));
  return parseInt(game_id.game_id);
};

const GAMES_LIST_SQL = `SELECT * FROM games WHERE joinable=true;`;
const list = async (user_id) => db.any(GAMES_LIST_SQL, [user_id]);

const join = async (game_id, user_id) => {
  // User is added to game (they are added to the game_users table with the corresponding game_id)

  // Read player_count from game from games table with game_id
  let player_count = await db.one(
    "SELECT player_count FROM games WHERE id=$1",
    [game_id]
  );

  // Add 1 to player_count
  console.log("Player count: ");
  console.log(player_count);
  player_count = player_count.player_count;
  player_count++;
  console.log("Player count: " + player_count);

  // Insert into game_users table with game_id, user_id, player_count
  const INSERT_GAME_USER_SQL =
    "INSERT INTO game_users (game_id, user_id, play_order) VALUES ($1, $2, $3)";
  const INSERT_INVENTORY_SQL =
    "INSERT INTO inventory (user_id, game_id) VALUES ($1, $2)";
  const INSERT_PROPERTY_INV_SQL =
    "INSERT INTO property_inventory (user_id, game_id) VALUES ($1, $2)";
  await db.none(INSERT_GAME_USER_SQL, [game_id, user_id, player_count]);
  await db.none(INSERT_INVENTORY_SQL, [user_id, game_id]);
  await db.none(INSERT_PROPERTY_INV_SQL, [user_id, game_id]);

  // Update games table with new player_count
  await db.none("UPDATE games SET player_count=$1 WHERE id=$2", [
    player_count,
    game_id,
  ]);
};

//const startGame = async (game_id, user_id) => {

const endGame = async (game_id, user_id) => {
  const END_GAME_SQL = `DELETE FROM games WHERE id=$1`;
  const DELETE_GAME_USERS_SQL = `DELETE FROM game_users WHERE game_id=$1`;
  const DELETE_INVENTORY_SQL = `DELETE FROM inventory WHERE game_id=$1`;
  const DELETE_PROPERTY_INV_SQL = `DELETE FROM property_inventory WHERE game_id=$1`;
  await db.none(END_GAME_SQL, [game_id]); // Deletes the game
  await db.none(DELETE_GAME_USERS_SQL, [game_id]); // Deletes all game_users of the game
  await db.none(DELETE_INVENTORY_SQL, [game_id]); // Deletes all inventories in the game
  await db.none(DELETE_PROPERTY_INV_SQL, [game_id]); // Deletes all property inventories in the game
};

// Create and return the game state
const state = async (game_id, user_id) => {
  // Dealing with the game_users table
  const users = await db.many(
    "SELECT users.username, users.id AS user_id FROM users, game_users WHERE users.id=game_users.user_id AND game_users.game_id=$1 ORDER BY game_users.play_order",
    [game_id]
  );

  return {
    game_id,
    users,
    user_id,
  };
};

module.exports = { create, list, join, endGame, getGame, state };
