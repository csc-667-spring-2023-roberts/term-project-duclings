import socket from "./utilities/socket.js";
import { getGameId } from "./games/get-game-id.js";
import { gameUpdatedHandler } from "./games/updated.js";

const gameID = getGameId(document.location.pathname);

gameUpdatedHandler(socket, gameID);

document.getElementById("test-socket-button").addEventListener("click", () => {
  console.log("TEST BUTTON CLICKED");
  test();
});
