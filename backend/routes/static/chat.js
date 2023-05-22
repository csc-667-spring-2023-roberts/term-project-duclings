// File to handle POST requests to /chat/:id and broadcast the message to all clients

const express = require("express");
const router = express.Router();
const events = require("../../sockets/constants.js");
const Chat = require("../../db/chat.js");

router.post("/:id", async (request, response) => {
  const io = request.app.get("io");
  const { message } = request.body;
  const { username, id } = request.session.user;
  const game_id = request.params.id;

  const { created_at: timestamp } = await Chat.create(game_id, id, message);

  console.log("Message received");

  // io.in(game_id).emit(events.CHAT_MESSAGE_RECEIVED, {
  io.to(game_id).emit(events.CHAT_MESSAGE_RECEIVED, {
    // This gets chat to show up but not how we want to do sockets since we want to target specific game rooms only
    // io.emit(events.CHAT_MESSAGE_RECEIVED, {
    message,
    username,
    timestamp,
  });

  response.status(200);
});

module.exports = router;
