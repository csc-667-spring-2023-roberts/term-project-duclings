const express = require("express");
const router = express.Router();
const Chat = require("../../db/chat");
const Games = require("../../db/games.js");

router.get("/:id", async (request, response) => {
  const { id: game_id } = request.params;
  console.log("game-session game_id: " + game_id);

  try {
    const chat = await Chat.getMessages(game_id);
    const current_players = await Games.listPlayers(game_id);
    console.log("Current Players", current_players);

    response.render("game-session", {
      id: game_id,
      title: "Monopoly | Game " + game_id,
      playersList: current_players,
      messages: chat,
    });
  } catch (error) {
    console.log({ error });
    response.render("game-session", {
      id: game_id,
      title: "Monopoly | Game " + game_id,
      playersList: [],
      messages: [],
    });
  }
});

module.exports = router;
