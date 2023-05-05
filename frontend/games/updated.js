import { GAME_UPDATED } from "../../shared/constants";

export function gameUpdatedHandler(socket, game_id) {
  socket.on(GAME_UPDATED(game_id), (game_state) => {
    console.log({ game_state });
  });
}
