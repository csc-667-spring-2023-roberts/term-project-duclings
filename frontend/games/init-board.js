export function initSpaceDialogs() {
  console.log("Load");
  for (let i = 1; i < 42; i++) {
    let cellSpace = document.getElementById(`b-${i}`);
    if (cellSpace.classList.contains("property")) {
      console.log(i, "PROPERTY");
      cellSpace.addEventListener("click", () => {
        console.log(i);
        document.getElementById(`card-popup-${i}`).showModal();
      });
    }
    // console.log(document.getElementById(`b-${i}`));
  }
}
