const express = require("express");
const router = express.Router();
const Chat = require("../../db/chat");
const Games = require("../../db/games.js");
const Users = require("../../db/users.js");

router.get("/:id", async (request, response) => {
  const { id: game_id } = request.params;
  const { user_id } = request.session.user;
  console.log("game-session game_id: " + game_id);

  try {
    const chat = await Chat.getMessages(game_id);
    const current_players = await Games.listPlayers(game_id);
    const gameState = await Games.state(game_id, user_id);

    let player_usernames = [];
    for (let i = 0; i < current_players.length; i++) {
      const username = await Users.getUsername(current_players[i].user_id);
      const id = current_players[i].user_id;
      const money = gameState.inventories.find((i) => i.user_id === id).balance;
      player_usernames.push({ username, id, money });
    }
    // console.log("Current Players", player_usernames);

    response.render("game-session", {
      id: game_id,
      title: "Monopoly | Game " + game_id,
      playersList: gameState.users,
      playersNames: player_usernames,
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
