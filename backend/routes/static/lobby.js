const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("lobby", { title: "Team Ducling's term project" });
});

module.exports = router;
