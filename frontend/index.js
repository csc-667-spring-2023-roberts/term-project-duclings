import io from "socket.io-client";
import events from "../backend/sockets/constants";
import { gameCreatedHandler } from "./games/created";
import { gameUpdatedHandler } from "./games/updated";
import { getGameId } from "./games/get-game-id";
import { joinGameHandler } from "./games/update-games-list";
import { messageReceivedHandler } from "./games/chat";

const game_id = getGameId(document.location.pathname);

const socket = io();

socket.emit("join", game_id);

socket.on("gameEnded", () => {
  alert("Game ended");
  window.location.href = "/home";
});

socket.on("startGame", (game_id) => {
  console.log("redirecting to " + game_id);
  window.location.href = `/games/${game_id}`;
});

socket.on(events.CHAT_MESSAGE_RECEIVED, ({ username, message, timestamp }) => {
  console.log("message received");

  const entry = document.createElement("div");

  const displayName = document.createElement("span");
  displayName.innerText = username;
  const displayMessage = document.createElement("span");
  displayMessage.innerText = message;
  const displayTimestamp = document.createElement("span");
  displayTimestamp.innerText = timestamp;

  entry.appendChild(displayName, displayMessage, displayTimestamp);

  messageContainer.append(entry);
});

gameCreatedHandler(socket);
joinGameHandler(socket);
gameUpdatedHandler(socket, game_id);
messageReceivedHandler(socket);
