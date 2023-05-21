const express = require("express");
const Games = require("../../db/games.js");
const Users = require("../../db/users.js");
const router = express.Router();
const Chat = require("../../db/chat");

router.get("/:id", async (request, response) => {
  const { id: game_id } = request.params;
  // const { user_id } = request.session.user;

  //console.log("PRINTING THE SESSION USER HERE" + request.session.user);
  try {
    // const game_id = await Games.getGame(user_id);
    const current_players = await Games.listPlayers(game_id);

    const player_usernames = [];
    for (let i = 0; i < current_players.length; i++) {
      const username = await Users.getUsername(current_players[i].user_id);
      player_usernames.push({ username });
    }

    // To get attributes of an object - needed to call when printing on the ejs page
    /*const attributes = Object.keys(current_players);
    for (let i = 0; i < attributes.length; i++) {
      const key = attributes[i];
      const value = current_players[key];
      console.log("Key:", key);
      console.log("Value:", value);
    }*/
    const chat = await Chat.getMessages(game_id);

    response.render("lobby", {
      id: game_id,
      title: "Monopoly | Waiting for Game " + game_id,
      playersList: player_usernames,
      messages: chat,
    });
  } catch (error) {
    console.log({ error });
    response.render("lobby", {
      id: game_id,
      title: "Monopoly | Waiting for Game " + game_id,
      playersList: [],
      messages: [],
    });
  }
});

module.exports = router;
