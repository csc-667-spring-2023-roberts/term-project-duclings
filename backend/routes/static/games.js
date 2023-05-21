const express = require("express");
const router = express.Router();
const Chat = require("../../db/chat");

router.get("/:id", async (request, response) => {
  const { id: game_id } = request.params;
  // console.log("game-session game_id: " + game_id);

  try {
    const chat = await Chat.getMessages(game_id);
    response.render("game-session", {
      id: game_id,
      title: "Monopoly | Game " + game_id,
      messages: chat,
    });
  } catch (error) {
    console.log({ error });
  }

  response.render("game-session", {
    id: game_id,
    title: "Monopoly | Game " + game_id,
    messages: [],
  });
});

module.exports = router;
