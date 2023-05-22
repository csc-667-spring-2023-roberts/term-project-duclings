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

// Ensures the chance_cards table is populated. Otherwise, no game can be played properly
const checkChanceCards = async () => {
  console.log("Checking if chance cards are correct...");
  const rows = await db.any("SELECT * FROM chance_deck");

  const rowCount = rows.length;

  if (rowCount === 0) {
    const chanceCardsPath = __dirname + "/chance_cards.json";
    // Read the chance card data from the JSON file
    const chanceCards = JSON.parse(fs.readFileSync(chanceCardsPath));
    // Insert the chance card data into the database
    for (const chanceCard of chanceCards) {
      const query = {
        text: `INSERT INTO chance_deck
            (card_id, card_text, action_type, action_data)
            VALUES
            ($1, $2, $3, $4)`,
        values: [
          chanceCard.card_id,
          chanceCard.card_text,
          chanceCard.action_type,
          chanceCard.action_data,
        ],
      };
      await db.query(query);
    }
  } else {
    console.log("chance_cards table is already populated");
  }
};

// Ensures the community_chest_cards table is populated. Otherwise, no game can be played properly
const checkCommunityChestCards = async () => {
  console.log("Checking if community chest cards are correct...");
  const rows = await db.any("SELECT * FROM community_chest_deck");

  const rowCount = rows.length;

  if (rowCount === 0) {
    const communityChestCardsPath = __dirname + "/community_chest_cards.json";
    // Read the community chest card data from the JSON file
    const communityChestCards = JSON.parse(
      fs.readFileSync(communityChestCardsPath)
    );
    // Insert the community chest card data into the database
    for (const communityChestCard of communityChestCards) {
      const query = {
        text: `INSERT INTO community_chest_deck
            (card_id, card_text, action_type, action_data)
            VALUES
            ($1, $2, $3, $4)`,
        values: [
          communityChestCard.card_id,
          communityChestCard.card_text,
          communityChestCard.action_type,
          communityChestCard.action_data,
        ],
      };
      await db.query(query);
    }
  } else {
    console.log("community_chest_cards table is already populated");
  }
};

// Creates a game board to be used for a new game
const createGameBoard = async (game_id) => {
  const boardSpacesPath = __dirname + "/board_spaces.json";
  // Read the board space data from the JSON file
  const boardSpaces = JSON.parse(fs.readFileSync(boardSpacesPath));
  // Insert the board space data into the database
  for (const boardSpace of boardSpaces) {
    const query = {
      text: `INSERT INTO board_spaces
          (game_id, board_position, space_name, space_type)
          VALUES
          ($1, $2, $3, $4)`,
      values: [
        game_id,
        boardSpace.board_position,
        boardSpace.space_name,
        boardSpace.space_type,
      ],
    };
    await db.query(query);
  }
};

// Creates a new game
const create = async (creator_id) => {
  /* // Save this for later ...
  if (checkIfInAGame(creator_id)) {
    throw new Error("Error thrown: Player is already in a game");
  }
  */
  checkPropertyInfo(); // Checks if property_info table is populated. If not, populates it so users can play the game
  checkChanceCards(); // Checks if chance_cards table is populated. If not, populates it so users can play the game
  checkCommunityChestCards(); // Checks if community_chest_cards table is populated. If not, populates it so users can play the game

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
  createGameBoard(id); // Creates the game board for this game (in the database in the board_spaces table)

  return { id }; // Returns the game id
};

const getGame = async (user_id) => {
  console.log("Getting game ID...");
  const game_id = await db.one(
    "SELECT game_id FROM game_users WHERE user_id=$1",
    [user_id]
  );
  console.log(parseInt(game_id.game_id));
  return parseInt(game_id.game_id);
};

// Gets the list of all games that are joinable
const GAMES_LIST_SQL = `SELECT * FROM games WHERE joinable=true;`;
const listGames = async (user_id) => db.any(GAMES_LIST_SQL, [user_id]);

// Gets the list of all the players in the current game being played and sort them by play_order
// const PLAYERS_LIST_SQL = `SELECT user_id FROM game_users WHERE game_id=$1 ORDER BY play_order ASC;`;
// TEMP WORKAROUND SO THAT THE SAME USER ISN'T LISTED MULTIPLE TIMES IN THE PLAYERS LIST WHEN JOINING THE SAME GAME - needs to be prevented in the future
const PLAYERS_LIST_SQL = `SELECT DISTINCT ON (user_id) user_id, play_order FROM game_users WHERE game_id = $1 ORDER BY user_id, play_order ASC;`;

const listPlayers = async (game_id) => db.any(PLAYERS_LIST_SQL, [game_id]);

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
  const DELETE_GAME_BOARD_SQL = `DELETE FROM board_spaces WHERE game_id=$1`;
  await db.none(END_GAME_SQL, [game_id]); // Deletes the game
  await db.none(DELETE_GAME_USERS_SQL, [game_id]); // Deletes all game_users of the game
  await db.none(DELETE_INVENTORY_SQL, [game_id]); // Deletes all inventories in the game
  await db.none(DELETE_PROPERTY_INV_SQL, [game_id]); // Deletes all property inventories in the game
  await db.none(DELETE_GAME_BOARD_SQL, [game_id]); // Deletes the game board
};

const start = async (game_id, user_id) => {
  console.log("Starting game...");
};

const getBoardPosition = async (game_id, user_id) => {
  const BOARD_POSITION_SQL = `SELECT board_position FROM game_users WHERE game_id=$1 AND user_id=$2`;
  const board_position = await db.one(BOARD_POSITION_SQL, [game_id, user_id]);
  console.log("Board position: " + board_position.board_position);
  return await board_position.board_position;
};

const move = async (game_id, user_id, board_position) => {
  await db.none(
    "UPDATE game_users SET board_position=$3 WHERE user_id=$2 AND game_id=$1",
    [user_id, game_id, board_position]
  );
  return await state(game_id, user_id);
};

// Create and return the game state
const state = async (game_id, user_id) => {
  // Dealing with the game_users table
  const users = await db.many(
    "SELECT users.username, users.id AS user_id FROM users, game_users WHERE users.id=game_users.user_id AND game_users.game_id=$1 ORDER BY game_users.play_order",
    [game_id]
  );

  const inventories = await db.many(
    `
  SELECT DISTINCT inventory.*, game_users.play_order
  FROM inventory
  JOIN game_users ON inventory.user_id = game_users.user_id
  WHERE inventory.game_id = $1 AND game_users.game_id = $1
  ORDER BY game_users.play_order
  `,
    [game_id]
  );

  return {
    game_id,
    users,
    inventories,
    user_id,
  };
};

// Updates the balance $$$ of the user in the inventory table
const updateBalance = async (amount, game_id, user_id) => {
  const UPDATE_BALANCE_SQL = `UPDATE inventory SET balance=$1 WHERE game_id=$2 AND user_id=$3`;

  await db.none(UPDATE_BALANCE_SQL, [amount, game_id, user_id]);
};

// Updates (adds to) count of property type in property_inventory
const addToPropertyInventory = async (game_id, user_id, property_id) => {
  const ADD_TO_PROPERTY_INV_SQL = `UPDATE property_inventory SET $1=$1+1 WHERE game_id=$2 AND user_id=$3`;
  await db.none(ADD_TO_PROPERTY_INV_SQL, [
    property_type_count,
    game_id,
    user_id,
  ]);
};

// Make player owner of property (expecting owner user_id, game_id, user_id)
const setPropertyOwner = async (game_id, user_id, property_id) => {
  const SET_OWNER_BOARD_SPACE_PROPERTY_INFO_SQL = `UPDATE board_spaces SET property_owner=$1 AND property_owned=true WHERE game_id=$2 AND user_id=$3`;
  await db.none(SET_OWNER_BOARD_SPACE_PROPERTY_INFO_SQL, [
    user_id,
    game_id,
    user_id,
  ]);
};

// Updates (removes from) count of property type in property_inventory
const removeFromPropertyInventory = async (game_id, user_id, property_id) => {
  // Remove from property_inventory
  const REMOVE_FROM_PROPERTY_INV_SQL = `UPDATE property_inventory SET $1=$1-1 WHERE game_id=$2 AND user_id=$3`;
  await db.none(REMOVE_FROM_PROPERTY_INV_SQL, [
    property_type_count,
    game_id,
    user_id,
  ]);
};

// Remove owner from property (expecting owner user_id, game_id, user_id)
const removePropertyOwner = async (game_id, user_id, property_id) => {
  const REMOVE_OWNER_BOARD_SPACE_PROPERTY_INFO_SQL = `UPDATE board_spaces SET property_owner=$1 AND property_owned=true WHERE game_id=$2 AND user_id=$3`;
  await db.none(REMOVE_OWNER_BOARD_SPACE_PROPERTY_INFO_SQL, [
    user_id,
    game_id,
    user_id,
  ]);
};

// When a player rolls doubles
const getSnakeEyes = async (game_id, user_id) => {
  const GET_SNAKE_EYES_SQL = `SELECT dice_doubles_count FROM game_users WHERE game_id=$1 AND user_id=$2`;
  const snake_eyes = await db.one(GET_SNAKE_EYES_SQL, [game_id, user_id]);
  return snake_eyes.dice_doubles_count;
};

// When a player rolls doubles
const updateSnakeEyes = async (game_id, user_id) => {
  const UPDATE_SNAKE_EYES_SQL = `UPDATE game_users SET dice_doubles_count=dice_doubles_count+1 WHERE game_id=$1 AND user_id=$2`;
  await db.none(UPDATE_SNAKE_EYES_SQL, [game_id, user_id]);
};

const countJailFreeCards = async (game_id, user_id) => {
  const JAIL_FREE_CARD_SQL = `SELECT jail_free_card FROM inventory WHERE game_id=$1 AND user_id=$2`;
  const jail_free_card_count = await db.one(JAIL_FREE_CARD_SQL, [
    game_id,
    user_id,
  ]);
  return jail_free_card_count;
};

const incrementTurnNumber = async (game_id, user_id) => {
  const INCREMENT_TURN_NUMBER_SQL = `UPDATE game_users SET turn_number=turn_number+1 WHERE game_id=$1 AND user_id=$2`;
  await db.none(INCREMENT_TURN_NUMBER_SQL, [game_id, user_id]);
};

const incrementJailTurns = async (game_id, user_id) => {
  const INCREMENT_JAIL_TURNS_SQL = `UPDATE game_users SET jail_turns=jail_turns+1 WHERE game_id=$1 AND user_id=$2`;
  await db.none(INCREMENT_JAIL_TURNS_SQL, [game_id, user_id]);
};

const setMortgaged = async (game_id, user_id, property_id) => {
  const SET_MORTGAGED_SQL = `UPDATE board_spaces SET mortgaged=true WHERE game_id=$1 AND user_id=$2 AND property_id=$3`;
  await db.none(SET_MORTGAGED_SQL, [game_id, user_id, property_id]);
};

const setUnmortaged = async (game_id, user_id, property_id) => {
  const SET_UNMORTGAGED_SQL = `UPDATE board_spaces SET mortgaged=false WHERE game_id=$1 AND user_id=$2 AND property_id=$3`;
  await db.none(SET_UNMORTGAGED_SQL, [game_id, user_id, property_id]);
};

// When a player loses
const updateAliveStatus = async (game_id, user_id) => {
  const UPDATE_ALIVE_STATUS_SQL = `UPDATE game_users SET alive=false WHERE game_id=$1 AND user_id=$2`;
  await db.none(UPDATE_ALIVE_STATUS_SQL, [game_id, user_id]);
};

module.exports = {
  create,
  listGames,
  listPlayers,
  join,
  endGame,
  move,
  getGame,
  start,
  state,
  getBoardPosition,
  updateBalance,
};
