const express = require("express");

const router = express.Router();

router.get("/", (request, response) => {
  response.render("front-page", { title: "Team Ducling's term project" });
});

module.exports = router;
