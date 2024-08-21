//* Display / UI

//TODO: Give each number a relative color (i.e. blue for 1, green for 2, etc.).
//TODO: Make different set difficulties that the user can choose from, e.g. Easy, medium, hard.

import {
  createBoard,
  markTile,
  tileStatuses,
  revealTile,
  checkWin,
  checkLose,
} from "./logic.js";

const boardSize = 9;
const totalMines = 10;

const board = createBoard(boardSize, totalMines);
const boardElement = document.querySelector(".board");
const minesRemainingText = document.querySelector("[data-mine-count]");
const gameMsg = document.querySelector(".subtext");

console.log(board);

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    }); //TODO: Left click on tiles - reveal tiles --> DONE.
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesRemaining();
    }); //TODO: Right click on tiles - mark tiles --> DONE.
  });
});
boardElement.style.setProperty("--size", boardSize);
minesRemainingText.textContent = totalMines;

function listMinesRemaining() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === tileStatuses.marked).length
    );
  }, 0);

  minesRemainingText.textContent = totalMines - markedTilesCount;
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    boardElement.addEventListener("click", stopPropagation, { capture: true });
    boardElement.addEventListener("contextmenu", stopPropagation, {
      capture: true,
    });
  }

  if (win) {
    gameMsg.textContent = "You Win!";
  }
  if (lose) {
    gameMsg.textContent = "You Lose :(";
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === tileStatuses.marked) markTile(tile);
        if (tile.mine) revealTile(board, tile);
      });
    });
  }
} //TODO: Check for win/loss --> DONE.

function stopPropagation(e) {
  e.stopImmediatePropagation();
}
