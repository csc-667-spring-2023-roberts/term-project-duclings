const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  const name = "steven vasquez";

  res.render("home", { title: "Steven's term project" });
});

module.exports = router;
