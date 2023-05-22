export function movePlayer(playerId, spaceId) {
  let board = document.getElementById("board-main");
  let space = document.getElementById(`b-${spaceId}`);
  let player = document.getElementById(`p${playerId}`);
  let boardRect = board.getBoundingClientRect();
  let spaceRect = space.getBoundingClientRect();
  let playerRect = player.getBoundingClientRect();
  let padding = 4;

  if (spaceId == "11") {
    let jailRect = document.getElementById("b-41").getBoundingClientRect();

    let jvRight =
      board.getBoundingClientRect().right -
      space.getBoundingClientRect().right +
      jailRect.width;
    let jvTop =
      board.getBoundingClientRect().bottom -
      space.getBoundingClientRect().top -
      playerRect.height;
    let jvBottom =
      board.getBoundingClientRect().bottom -
      space.getBoundingClientRect().bottom;

    let jhLeft =
      board.getBoundingClientRect().right -
      space.getBoundingClientRect().right +
      jailRect.width;
    let jhRight =
      board.getBoundingClientRect().right - space.getBoundingClientRect().right;
    let cell = Math.round(Math.random());
    if (cell == 1) {
      player.style.bottom = Math.floor(
        Math.random() * (jvTop - jvBottom + 1) + jvBottom
      );
      player.style.right = jvRight;
    } else {
      player.style.bottom = jvBottom;
      player.style.right = Math.floor(
        Math.random() * (jhLeft - jhRight + 1) + jhRight
      );
    }
  } else {
    let cellBottom =
      board.getBoundingClientRect().bottom -
      space.getBoundingClientRect().bottom +
      padding;
    let cellTop =
      board.getBoundingClientRect().bottom -
      space.getBoundingClientRect().top -
      playerRect.height -
      padding;
    let cellLeft =
      board.getBoundingClientRect().right -
      space.getBoundingClientRect().left -
      playerRect.width -
      padding;
    let cellRight =
      board.getBoundingClientRect().right -
      space.getBoundingClientRect().right +
      padding;

    player.style.bottom = Math.floor(
      Math.random() * (cellTop - cellBottom + 1) + cellBottom
    );
    player.style.right = Math.floor(
      Math.random() * (cellLeft - cellRight + 1) + cellRight
    );
  }
}
