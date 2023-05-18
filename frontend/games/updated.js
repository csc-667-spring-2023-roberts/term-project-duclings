import { GAME_UPDATED } from "../../shared/constants";

// Updates the game state - do stuff to reflect new game state
export function gameUpdatedHandler(socket, game_id) {
  socket.on(GAME_UPDATED(game_id), (game_state) => {
    // TODO: update the game board here whenever a player does an action
    console.log({ game_state });
  });
}
