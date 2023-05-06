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

    response.redirect("/lobby");
  }
});

// Make a move in a game
router.post("/:id/move", async (request, response) => {
  const { id: game_id } = request.params;
  const { id: user_id } = request.session.user;
  const { x, y } = request.body;
  const io = request.app.get("io");

  try {
    const state = await Games.isMoveValid(game_id, user_id, x, y);
    io.emit(GAME_UPDATED(game_id), state);

    response.status(200).send();
  } catch (error) {
    console.log({ error });

    response.status(500).send();
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
    io.emit(GAME_UPDATED(game_id), state);

    response.redirect(`/games/${game_id}`);
  } catch (error) {
    console.log({ error });

    response.redirect("/lobby");
  }
});

module.exports = router;
