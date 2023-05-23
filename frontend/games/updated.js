import { GAME_UPDATED } from "../../shared/constants";
import { movePlayer } from "./update-player-pos";

// Updates the game state - do stuff to reflect new game state
export function gameUpdatedHandler(socket, game_id) {
  /*
  const test_user = game_state.users[1].user_id;
  const test_board_position = game_state.users[1].board_position;
  console.log("Test user: " + test_user);
  console.log("Test position: " + test_board_position);
  */
  socket.on(GAME_UPDATED, (game_state) => {
    //window.location.href = `/home`;
    //TODO: //movePlayer( needs id from game users, and board position from game users)
  });
}

//Example output:
// state:
// {
//   game_id: '108',
//   users: [
//     {
//       game_id: 108,
//       user_id: 5,
//       current_player: true,
//       play_order: 1,
//       board_position: 1,
//       dice_doubles_count: 0,
//       alive: true
//     },
//     {
//       game_id: 108,
//       user_id: 1,
//       current_player: false,
//       play_order: 2,
//       board_position: 1,
//       dice_doubles_count: 0,
//       alive: true
//     },
//     {
//       game_id: 108,
//       user_id: 5,
//       current_player: false,
//       play_order: 3,
//       board_position: 1,
//       dice_doubles_count: 0,
//       alive: true
//     },
//     {
//       game_id: 108,
//       user_id: 3,
//       current_player: false,
//       play_order: 4,
//       board_position: 1,
//       dice_doubles_count: 0,
//       alive: true
//     }
//   ],
//   inventories: [
//     {
//       user_id: 5,
//       game_id: 108,
//       balance: 1500,
//       jail_turns: 0,
//       jail_free_card: 0,
//       play_order: 1
//     },
//     {
//       user_id: 1,
//       game_id: 108,
//       balance: 1500,
//       jail_turns: 0,
//       jail_free_card: 0,
//       play_order: 2
//     },
//     {
//       user_id: 5,
//       game_id: 108,
//       balance: 1500,
//       jail_turns: 0,
//       jail_free_card: 0,
//       play_order: 3
//     },
//     {
//       user_id: 3,
//       game_id: 108,
//       balance: 1500,
//       jail_turns: 0,
//       jail_free_card: 0,
//       play_order: 4
//     }
//   ],
//   user_id: 3
// }
