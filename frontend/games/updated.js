import { GAME_UPDATED } from "../../shared/constants";
import { movePlayer } from "./update-player-pos";

// Updates the game state - do stuff to reflect new game state
export function gameUpdatedHandler(socket, game_id) {
  console.log("gameUpdatedHandler reached");
  socket.on(GAME_UPDATED, (game_state) => {
    window.location.href = `/home`;
  });
}
