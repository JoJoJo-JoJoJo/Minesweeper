//* Display / UI

import {
  createBoard,
  markTile,
  tileStatuses,
  revealTile,
  checkWin,
  checkLose,
} from "./logic.js";

const boardSize = {
  easy: 9,
  medium: 16,
  hard: {
    cols: 32, // This is the 'x' value
    rows: 16, // This is the 'y' value
  },
};

const totalMines = {
  easy: 10,
  medium: 40,
  hard: 100,
};

let currentBoardSize;
let currentTotalMines = 10;

currentBoardSize = sessionStorage.getItem("newDifficulty")
  ? JSON.parse(sessionStorage.getItem("newDifficulty"))
  : boardSize.easy;

switch (JSON.parse(sessionStorage.getItem("newDifficulty"))) {
  case boardSize.easy:
    currentTotalMines = totalMines.easy;
    break;
  case boardSize.medium:
    currentTotalMines = totalMines.medium;
    break;
  case boardSize.hard:
    currentTotalMines = totalMines.hard;
    break;
}

console.log(currentBoardSize); //! ------------------------------------------------------- !
console.log(currentTotalMines); //! ------------------------------------------------------ !
console.log(JSON.parse(sessionStorage.getItem("newDifficulty"))); //! -------------------- !

const easyBtn = document.getElementById("difficulty-easy");
const mediumBtn = document.getElementById("difficulty-medium");
const hardBtn = document.getElementById("difficulty-hard");
const btnContainer = easyBtn.parentElement;

easyBtn.addEventListener("click", () => {
  sessionStorage.setItem("newDifficulty", JSON.stringify(boardSize.easy));
  location.replace(location.href);
});

mediumBtn.addEventListener("click", () => {
  sessionStorage.setItem("newDifficulty", JSON.stringify(boardSize.medium));
  location.replace(location.href);
});

hardBtn.addEventListener("click", () => {
  sessionStorage.setItem("newDifficulty", JSON.stringify(boardSize.hard));
  location.replace(location.href);
});

const boardElement = document.querySelector("[data-board]");

if (currentBoardSize?.cols && currentBoardSize?.rows) {
  boardElement.style.setProperty("--col-size", currentBoardSize.cols);
  boardElement.style.setProperty("--row-size", currentBoardSize.rows);
  boardElement.classList.add("rectangle");
  btnContainer.classList.add("rectangle-extra-margin-top");
} else {
  boardElement.style.setProperty("--col-size", currentBoardSize);
  boardElement.style.setProperty("--row-size", currentBoardSize);
}

const board = createBoard(currentBoardSize, currentTotalMines);
const minesRemainingText = document.querySelector("[data-mine-count]");
const gameMsg = document.querySelector("[data-subtext]");

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      checkGameEnd();
    });
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesRemaining();
    });
  });
});

const colSize = boardElement.style.getPropertyValue("--col-size");
const rowSize = boardElement.style.getPropertyValue("--row-size");
boardElement.style.setProperty(
  "--font-size",
  colSize >= rowSize ? colSize : rowSize
);
minesRemainingText.textContent = currentTotalMines;

function listMinesRemaining() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === tileStatuses.marked).length
    );
  }, 0);

  minesRemainingText.textContent = currentTotalMines - markedTilesCount;
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
}

function stopPropagation(e) {
  e.stopImmediatePropagation();
}
