const express = require("express");
const router = express.Router();

router.get("/", (request, response) => {
    const name = "person";
  
    response.render("home", {
        title: "Hi World!",
        message: "Our first template.",
      });
  });

module.exports = router;