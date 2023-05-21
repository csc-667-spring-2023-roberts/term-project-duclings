import io from "socket.io-client";
import events from "../backend/sockets/constants";
import { gameCreatedHandler } from "./games/created";
//import { gameUpdatedHandler } from "./games/updated";
import { getGameId } from "./games/get-game-id";
import { joinGameHandler } from "./games/update-games-list";

const socket = io();

socket.on("gameEnded", () => {
  alert("Game ended");
  window.location.href = "/lobby";
});

const game_id = getGameId(document.location.pathname);
gameCreatedHandler(socket);
//gameUpdatedHandler(socket, game_id);
joinGameHandler(socket);

socket.emit("join", { game_id, username: "test" });

const messageContainer = document.querySelector("#messages");

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

document
  .querySelector("input#chatMessage")
  .addEventListener("keydown", (event) => {
    if (event.keyCode !== 13) {
      return;
    }

    const message = event.target.value;
    console.log("Sending " + message);

    fetch(`/chat/${game_id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  });
