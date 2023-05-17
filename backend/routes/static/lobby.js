const express = require("express");
const Games = require("../../db/games.js");
const Users = require("../../db/users.js");
const router = express.Router();

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  const { user_id } = request.session.user;

  //console.log("PRINTING THE SESSION USER HERE" + request.session.user);
  try {
    // const game_id = await Games.getGame(id);
    const current_players = await Games.listPlayers(id);
    console.log("current_players: ", current_players);

    const player_usernames = [];
    for (let i = 0; i < current_players.length; i++) {
      const username = await Users.getUsername(current_players[i].user_id);
      player_usernames.push({ username });
    }
    console.log("player_usernames: ", player_usernames);
    console.log("user_id: ", user_id);
    // To get attributes of an object - needed to call when printing on the ejs page
    /*const attributes = Object.keys(current_players);
    for (let i = 0; i < attributes.length; i++) {
      const key = attributes[i];
      const value = current_players[key];
      console.log("Key:", key);
      console.log("Value:", value);
    }*/

    response.render("lobby", {
      id,
      title: "Team Ducling's term project",
      playersList: player_usernames,
    });
  } catch (error) {
    console.log({ error });
    response.render("lobby", { id, playersList: [] });
  }
});

module.exports = router;
