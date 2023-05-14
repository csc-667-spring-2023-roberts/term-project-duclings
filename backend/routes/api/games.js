const express = require("express");
const Games = require("../../db/games.js");
const { GAME_CREATED, GAME_UPDATED } = require("../../../shared/constants.js");

const router = express.Router();

// See list of games
router.get("/", async (request, response) => {
  const { id: user_id } = request.session.user;

  try {
    const available_games = await Games.list(user_id);

    response.json(available_games);
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
    response.redirect(`/games/${game_id}`);
  } catch (error) {
    console.log({ error });
    // display message stored in "error"
    response.redirect("/lobby");
  }
});

// Make a move in a game (tic-tac-toe example)
// ...

// Join a game
router.get("/:id/join", async (request, response) => {
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const io = request.app.get("io");

  try {
    await Games.join(game_id, user_id);

    const state = await Games.state(game_id, user_id);
    io.emit(GAME_UPDATED(game_id), state);

    response.redirect(`/games/${game_id}`);
  } catch (error) {
    console.log({ error });

    response.redirect("/lobby");
  }
});

// End a game
router.post("/endGame", async (request, response) => {
  const { id: user_id } = request.session.user;
  const { id: game_id } = await Games.getGame(user_id);
  const io = request.app.get("io");

  try {
    await Games.endGame(game_id, user_id);

    //const state = await Games.state(game_id, user_id);
    //io.emit(GAME_UPDATED(game_id), state);

    response.redirect(`/lobby`);
    console.log("Game ended");
  } catch (error) {
    console.log({ error });
  }
});

module.exports = router;
