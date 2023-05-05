const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  const name = "steven vasquez";

  res.render("home", { title: "Team Ducling's term project" });
});

module.exports = router;
