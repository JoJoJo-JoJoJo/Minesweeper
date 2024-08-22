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

/* If I set a variable that contains the value of a difficulty, then the 3 buttons change
that value. */
/* This didn't quite solve the problem, need to recreate the board to change difficulties,
and then edit the 'logic.js' file to work with the differing cols and rows on hard mode. */

const boardSize = {
  easy: 9,
  medium: 16,
  hard: {
    cols: 32, // This is the 'x' value
    rows: 16, // This is the 'y' value
  },
};
let currentBoardSize = boardSize.hard;

const totalMines = {
  easy: 10,
  medium: 40,
  hard: 100,
};
let currentTotalMines = totalMines.easy;

//* Easy and medium modes work, doing hard mode currently.

const easyBtn = document.getElementById("difficulty-easy");
const mediumBtn = document.getElementById("difficulty-medium");
const hardBtn = document.getElementById("difficulty-hard");

easyBtn.addEventListener("click", () => {
  currentBoardSize = boardSize.easy;
  currentTotalMines = totalMines.easy;
});

mediumBtn.addEventListener("click", () => {
  currentBoardSize = boardSize.medium;
  currentTotalMines = totalMines.medium;
});

hardBtn.addEventListener("click", () => {
  currentBoardSize = boardSize.hard;
  currentTotalMines = totalMines.hard;
});

const board = createBoard(currentBoardSize, currentTotalMines);
const boardElement = document.querySelector("[data-board]");
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
    }); //TODO: Left click on tiles - reveal tiles --> DONE.
    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      markTile(tile);
      listMinesRemaining();
    }); //TODO: Right click on tiles - mark tiles --> DONE.
  });
});

if (currentBoardSize?.cols && currentBoardSize?.rows) {
  boardElement.style.setProperty("--col-size", currentBoardSize.cols);
  boardElement.style.setProperty("--row-size", currentBoardSize.rows);
} else {
  boardElement.style.setProperty("--col-size", currentBoardSize);
  boardElement.style.setProperty("--row-size", currentBoardSize);
}

/*
 * Checks if the board size of the current difficulty has seperate 'cols' and 'rows'
 * properties, and if so sets the css variables to the different values.
 */

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
} //TODO: Check for win/loss --> DONE.

function stopPropagation(e) {
  e.stopImmediatePropagation();
}
