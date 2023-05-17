const express = require("express");
const Games = require("../../db/games.js");
const router = express.Router();

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  // const { userId: user_id } = request.session.user;

  //console.log("PRINTING THE SESSION USER HERE" + request.session.user);
  try {
    // const game_id = await Games.getGame(id);
    const current_players = await Games.listPlayers(id);

    // To get attributes of an object - needed to call when printing on the ejs page
    // for (let i = 0; i < attributes.length; i++) {
    //   const key = attributes[i];
    //   const value = current_players[key];
    //   console.log("Key:", key);
    //   console.log("Value:", value);
    // }

    response.render("lobby", {
      id,
      title: "Team Ducling's term project",
      playersList: current_players,
    });
  } catch (error) {
    console.log({ error });
    response.render("lobby", { id, playersList: [] });
  }
});

module.exports = router;
