const express = require("express");

const router = express.Router();

router.get("/:id", (req, res) => {
  const { id } = req.params;

  res.render("games", { id, title: "Team Ducling's term project" });
});

module.exports = router;
