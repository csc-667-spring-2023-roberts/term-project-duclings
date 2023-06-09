import io from "socket.io-client";
import { gameCreatedHandler } from "./games/created";
import { gameUpdatedHandler } from "./games/updated";
import { getGameId } from "./games/get-game-id";
import { joinGameHandler } from "./games/update-games-list";
import { messageReceivedHandler } from "./games/chat";
import { initSpaceDialogs } from "./games/init-board";
import { initRoll } from "./games/roll-dice";

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

gameCreatedHandler(socket);
joinGameHandler(socket);
gameUpdatedHandler(socket, game_id);
messageReceivedHandler(socket);
initSpaceDialogs();
initRoll();

export default socket;
