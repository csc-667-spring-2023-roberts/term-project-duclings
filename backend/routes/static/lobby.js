const express = require("express");

const router = express.Router();

router.get("/", (request, res) => {
  console.log("PRINTING THE SESSINO USER HERE" + req.session.user);
  res.render("lobby", {
    title: "Steven's term project",
    user: req.session.user,
  });
});

module.exports = router;
