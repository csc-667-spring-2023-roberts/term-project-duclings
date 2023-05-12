const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  const name = "steven vasquez";

  res.render("home", { title: "Team Ducling's term project" });
});

router.get("/gamesession", (req, res) => {
  console.log("gamesesh")
  res.render("gamesession");
})

module.exports = router;
