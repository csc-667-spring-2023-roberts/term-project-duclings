import { GAME_JOINED } from "../../shared/constants";

const playerList = document.querySelector("#player-list");
const itemTemplate = document.querySelector("#player-item");

export function createPlayerListItem(username) {
  const entry = itemTemplate.content.cloneNode(true);
  console.log("username: ", username);
  entry.querySelector("span").innerText = username;
  return entry;
}

export function joinGameHandler(socket) {
  socket.on(GAME_JOINED, ({ username }) => {
    console.log("joinGameHandler is called");
    playerList.appendChild(createPlayerListItem(username));
    // Append new player to list of players in the lobby
  });
}
