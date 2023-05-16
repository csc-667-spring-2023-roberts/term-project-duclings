const express = require("express");
const Games = require("../../db/games.js");
const router = express.Router();

router.get("/", async (request, response) => {
  const { id: user_id } = request.session.user;

  //console.log("PRINTING THE SESSION USER HERE" + request.session.user);
  try {
    const available_games = await Games.list(user_id);
    response.render("home", {
      // title: "Team Ducling's term project",
      // user: request.session.user,
      games: available_games,
    });
  } catch (error) {
    console.log({ error });
    response.render("home", { games: [] });
  }
});

module.exports = router;
