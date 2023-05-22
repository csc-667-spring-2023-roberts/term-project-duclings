import events from "../../backend/sockets/constants";
import { getGameId } from "./get-game-id";

const game_id = getGameId(document.location.pathname);
const messageContainer = document.querySelector("#messages");

export function messageReceivedHandler(socket) {
  socket.on(
    events.CHAT_MESSAGE_RECEIVED,
    ({ username, message, timestamp }) => {
      console.log("message received");

      const entry = document.createElement("div");

      messageContainer.insertAdjacentHTML(
        "afterbegin",
        `
          <div class="message-line">
            <div class="message">
              <p class="username">
                ${username}
              </p>
              <p class="body">
                ${message}
              </p>
            </div>
            <span class="timestamp">
              ${new Date(timestamp).toLocaleTimeString("en-US")}
            </span>
          </div>`
      );

      // const displayName = document.createElement("span");
      // displayName.innerText = username;
      // const displayMessage = document.createElement("span");
      // displayMessage.innerText = message;
      // const displayTimestamp = document.createElement("span");
      // displayTimestamp.innerText = timestamp;

      // entry.appendChild(displayName, displayMessage, displayTimestamp);

      // messageContainer.append(entry, displayMessage, displayTimestamp);
    }
  );
}

document
  .querySelector("input#chatMessage")
  .addEventListener("keydown", (event) => {
    if (event.keyCode !== 13) {
      return;
    }

    const message = event.target.value;
    console.log("Sending " + message);

    fetch(`/chat/${game_id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  });
