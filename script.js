//* Display / UI

//TODO: Give each number a relative color (i.e. blue for 1, green for 2, etc.).

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

/*
 * If I had made an object for each difficulty and given them boardSize and totalMines
 * properties rather than the other way around this would've been easier, but I didn't as
 * I built this game without the intention of extending it, so here we are.
 */

let currentBoardSize;
let currentTotalMines;

currentBoardSize = currentBoardSize
  ? localStorage.getItem("newDifficulty").JSON.parse(NEW_BOARD_SIZE)
  : boardSize.easy;
currentTotalMines = currentTotalMines
  ? localStorage.getItem("newDifficulty").JSON.parse(NEW_TOTAL_MINES)
  : totalMines.easy;

const easyBtn = document.getElementById("difficulty-easy");
const mediumBtn = document.getElementById("difficulty-medium");
const hardBtn = document.getElementById("difficulty-hard");

easyBtn.addEventListener("click", () => {
  currentBoardSize = boardSize.easy;
  currentTotalMines = totalMines.easy;
  localStorage.setItem(
    "newDifficulty",
    JSON.stringify({
      NEW_BOARD_SIZE: 9,
      NEW_TOTAL_MINES: 10,
    })
  );
  location.replace(location.href);
});

mediumBtn.addEventListener("click", () => {
  currentBoardSize = boardSize.medium;
  currentTotalMines = totalMines.medium;
  localStorage.setItem(
    "newDifficulty",
    JSON.stringify({
      NEW_BOARD_SIZE: 16,
      NEW_TOTAL_MINES: 40,
    })
  );
  location.replace(location.href);
});

hardBtn.addEventListener("click", () => {
  currentBoardSize = boardSize.hard;
  currentTotalMines = totalMines.hard;
  localStorage.setItem(
    "newDifficulty",
    JSON.stringify({
      NEW_BOARD_SIZE: {
        cols: 32,
        rows: 16,
      },
      NEW_TOTAL_MINES: 100,
    })
  );
  location.replace(location.href);
});

const boardElement = document.querySelector("[data-board]");

if (currentBoardSize?.cols && currentBoardSize?.rows) {
  boardElement.style.setProperty("--col-size", currentBoardSize.cols);
  boardElement.style.setProperty("--row-size", currentBoardSize.rows);
  boardElement.classList.add("rectangle");
} else {
  boardElement.style.setProperty("--col-size", currentBoardSize);
  boardElement.style.setProperty("--row-size", currentBoardSize);
}

const board = createBoard(currentBoardSize, currentTotalMines);
const minesRemainingText = document.querySelector("[data-mine-count]");
const gameMsg = document.querySelector("[data-subtext]");

/*
 * Need to check if each tile contains a number and is revealed, if so set that tile's
 * color property ("--tile-color") relative to the number in the tile.
 * Could do this by giving every tile a data-mines-around value, and then changing the color
 * by retrieving the property of the mine.
 */

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element);
    tile.element.addEventListener("click", () => {
      revealTile(board, tile);
      // tile.element.setProperty("--tile-color", (mines.length * 45) % 360);
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
