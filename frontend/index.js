import io from "socket.io-client";
import events from "../backend/sockets/constants";
import { gameCreatedHandler } from "./games/created";
import { gameUpdatedHandler } from "./games/updated";
import { getGameId } from "./games/get-game-id";

const socket = io();
const game_id = getGameId(document.location.pathname);
gameCreatedHandler(socket);
gameUpdatedHandler(socket, game_id);

const messageContainer = document.querySelector("#messages");

socket.on(events.CHAT_MESSAGE_RECEIVED, ({ username, message, timestamp }) => {
  const entry = document.createElement("div");

  const displayName = document.createElement("span");
  displayName.innerText = username;
  const displayMessage = document.createElement("span");
  displayMessage.innerText = message;
  const displayTimestamp = document.createElement("span");
  displayTimestamp.innerText = timestamp;

  entry.appendChild(displayName, displayMessage, displayTimestamp);

  messageContainer.append(display);
});

document
  .querySelector("input#chatMessage")
  .addEventListener("keydown", (event) => {
    if (event.keyCode !== 13) {
      return;
    }

    const message = event.target.value;
    event.target.value = "";

    fetch("/chat/0", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  });
