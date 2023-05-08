// This file shows a list of created games
import { GAME_CREATED } from "../../shared/constants";

const gameList = document.querySelector("#game-list");
const itemTemplate = document.querySelector("#available-game-item");

// Displays list of available games to join
export function createGameListItem(game_id, _created_at) {
  const entry = itemTemplate.content.cloneNode(true);

  entry.querySelector("a").setAttribute("href", `/api/games/${game_id}/join`);
  entry.querySelector("span").innerText = game_id;

  return entry;
}

// Listens for new games being created
export function gameCreatedHandler(socket) {
  socket.on(GAME_CREATED, ({ game_id, created_at }) => {
    gameList.appendChild(createGameListItem(game_id, created_at));
  });
}
