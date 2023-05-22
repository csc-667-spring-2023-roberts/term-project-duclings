import { GAME_UPDATED } from "../../shared/constants";
import { movePlayer } from "./update-player-pos";

// Updates the game state - do stuff to reflect new game state
export function gameUpdatedHandler(socket, game_id) {
  socket.on(GAME_UPDATED(game_id), (game_state) => {
    game_state.users.forEach((user) => {
      console(
        "game updater: user.id, user.board_position",
        user.id,
        user.board_position
      );
      movePlayer(user.id, user.board_position);
    });

    console.log("the game state is....");
    console.log({ game_state });
  });
}
