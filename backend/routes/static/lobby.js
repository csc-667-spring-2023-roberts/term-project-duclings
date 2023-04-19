const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("lobby", { title: "Steven's term project" });
});

module.exports = router;
