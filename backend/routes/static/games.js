const express = require("express");

const router = express.Router();

router.get("/:id", (request, response) => {
  const { id } = request.params;

  // response.render("game-session", { id, title: "Team Ducling's term project" });
  response.render("game-session", { id, title: "Team Ducling's term project" });
});

module.exports = router;
