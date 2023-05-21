import io from "socket.io-client";
import getGameId from "../games/get-game-id.js";
const game_id = getGameId(document.location.pathname);
const socket = io({
  query: {
    roomID: game_id,
  },
});

socket.on("connect", () => {
  console.log("Connected with id: " + socket.id);
});

export default socket;
