const express = require("express");
const Games = require("../../db/games.js");
const Users = require("../../db/users.js");

const {
  GAME_CREATED,
  GAME_UPDATED,
  GAME_JOINED,
} = require("../../../shared/constants.js");

const router = express.Router();

// Get list of games
router.get("/", async (request, response) => {
  const { id: user_id } = request.session.user;

  try {
    const available_games = await Games.listGames(user_id);

    response.json(available_games);
  } catch (error) {
    console.log({ error });

    response.redirect("/home");
  }
});

// Get list of players
router.get("/", async (request, response) => {
  // Saves the user_id of whoever created the game
  const { game_id, id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    const current_players = await Games.listPlayers(user_id);
    console.log("game_id: ", game_id);
    io.emit(GAME_UPDATED(game_id), state);
    response.redirect(`/lobby/${game_id}`);

    response.json(current_players);
  } catch (error) {
    console.log({ error });

    response.redirect("/lobby");
  }
});

// Create new game
router.get("/create", async (request, response) => {
  // Saves the user_id of whoever created the game
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    const { id: game_id, created_at } = await Games.create(user_id);

    io.emit(GAME_CREATED, { game_id, created_at });
    response.redirect(`/lobby/${game_id}`);
  } catch (error) {
    console.log({ error });
    // display message stored in "error"
    response.redirect("/home");
  }
});

// Join a game
router.get("/:id/join", async (request, response) => {
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    await Games.join(game_id, user_id);

    const state = await Games.state(game_id, user_id);
    console.log("state: ");
    console.log(state);
    io.to(game_id).emit(GAME_UPDATED(game_id), state);

    const username = await Users.getUsername(user_id);
    console.log(
      "the username being sent to lobby websocket is " + username.username
    );
    //io.emit(GAME_JOINED,(username.username));
    io.to(game_id).emit(GAME_JOINED, username.username); // not working

    response.redirect(`/lobby/${game_id}`);
  } catch (error) {
    console.log({ error });

    response.redirect("/home");
  }
});

// Start a game
router.post("/:id/startGame", async (request, response) => {
  const { id: user_id } = request.session.user;
  const { id: game_id } = request.params;

  const io = request.app.get("io");
  try {
    io.to(game_id).emit("startGame", game_id);
    response.redirect(`/games/${game_id}`);
  } catch (error) {
    console.log({ error });

    response.redirect("/home");
  }
});

// End a game
router.post("/:id/endGame", async (request, response) => {
  const { id: user_id } = request.session.user;
  const { id: game_id } = request.params;

  const io = request.app.get("io");

  try {
    await Games.endGame(game_id, user_id);

    console.log("game_id to be ended: ", game_id);
    io.to(game_id).emit("gameEnded");

    response.redirect(`/home`);
    console.log("Game ended");
  } catch (error) {
    console.log({ error });
  }
});

// Dice roll click calls post request to move player
router.post("/:id/move", async (request, response) => {
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  var board_position = Games.getBoardPosition(game_id, user_id); // pre-move position
  const io = request.app.get("io");

  const diceRoll = 5; // TODO: get both dice rolls from front end
  console.log("board position from post: " + board_position);
  board_position = board_position + diceRoll; // new board position

  try {
    const state = await Games.move(game_id, user_id, diceRoll);
    io.to(game_id).emit(GAME_UPDATED(game_id), state);

    response.status(200).send();
  } catch (error) {
    console.log({ error });

    response.status(500).send();
  }
});

// Buy property
router.post("/:id/buyProperty", async (request, response) => {
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    //const state = await Games.buy(game_id, user_id); // TODO
    io.to(game_id).emit(GAME_UPDATED(game_id), state);

    response.status(200).send();
  } catch (error) {
    console.log({ error });

    response.status(500).send();
  }
});

// Buy house/hotel
router.post("/:id/buyHouseHotel", async (request, response) => {
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    //const state = await Games.buyHouse(game_id, user_id); // TODO
    io.to(game_id).emit(GAME_UPDATED(game_id), state);

    response.status(200).send();
  } catch (error) {
    console.log({ error });

    response.status(500).send();
  }
});

// Go to jail
router.post("/:id/goToJail", async (request, response) => {
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    //const state = await Games.goToJail(game_id, user_id); // TODO
    io.to(game_id).emit(GAME_UPDATED(game_id), state);

    response.status(200).send();
  } catch (error) {
    console.log({ error });

    response.status(500).send();
  }
});

// Leave jail
router.post("/:id/leaveJail", async (request, response) => {
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    //const state = await Games.leaveJail(game_id, user_id); // TODO
    io.to(game_id).emit(GAME_UPDATED(game_id), state);

    response.status(200).send();
  } catch (error) {
    console.log({ error });

    response.status(500).send();
  }
});

module.exports = router;
