const express = require("express");

const router = express.Router();

router.get("/", (request, response) => {
  response.render("front-page", { title: "Welcome to Monopoly!" });
});

module.exports = router;
