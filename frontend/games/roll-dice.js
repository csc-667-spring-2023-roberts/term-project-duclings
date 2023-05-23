import socket from "../index";

export function initRoll() {
  console.log("Init Roll");
  document.getElementById("roll-button").addEventListener("click", rollDice);
}

function rollDice() {
  console.log("Roll dice");
  let thisElem = document.getElementById("dice-roll-popup");
  let rollButton = document.getElementById("roll-button");
  let closeButton = document.getElementById("close-button");
  let dice1 = document.getElementById("dice1");
  let dice1text = document.getElementById("dice1-number");
  let dice2 = document.getElementById("dice2");
  let dice2text = document.getElementById("dice2-number");

  let d1 = Math.floor(Math.random() * 6 + 1);
  let d2 = Math.floor(Math.random() * 6 + 1);

  socket.emit("dice_result", { d1, d2 });

  for (let i = 1; i <= 6; i++) {
    dice1.classList.remove(`show-${i}`);
    dice2.classList.remove(`show-${i}`);
  }

  dice1.classList.add(`show-${d1}`);
  dice1text.innerHTML = d1;

  dice2.classList.add(`show-${d2}`);
  dice2text.innerHTML = d2;

  rollButton.disabled = true;
  rollButton.style.display = "none";
  closeButton.style.display = "block";

  setTimeout(() => {
    thisElem.close();
  }, 2000);
  return { d1, d2 };
}
