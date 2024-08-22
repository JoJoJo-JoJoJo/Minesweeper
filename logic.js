//* Logic

export const tileStatuses = {
  hidden: "hidden",
  mine: "mine",
  number: "number",
  marked: "marked",
};

//TODO: Populate a board with tiles/mines --> DONE.

//* USE OPTIONAL CHAINING ('?.') FOR HARD DIFFICULTY.

export function createBoard(currentBoardSize, currentTotalMines) {
  const board = [];
  const difficultyScalingX = currentBoardSize?.cols != null ? currentBoardSize.cols : currentBoardSize;
  const difficultyScalingY = currentBoardSize?.rows != null ? currentBoardSize.rows : currentBoardSize;
  const minePositions = getMinePositions(difficultyScalingX, difficultyScalingY, currentTotalMines);

  for (let x = 0; x < currentBoardSize; x++) {
    const row = [];
    for (let y = 0; y < currentBoardSize; y++) {
      const element = document.createElement("div");
      element.dataset.status = tileStatuses.hidden;

      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      };

      row.push(tile);
    }
    board.push(row);
  }

  return board;
}

//* The board will be a 2D array.
// [[{ x: 0, y: 0 }, { x: 0, y: 1 }], [{ x: 1, y: 0 }, { x: 1, y: 1 }]] would be a 2x2 board.

export function markTile(tile) {
  if (
    tile.status !== tileStatuses.hidden &&
    tile.status !== tileStatuses.marked
  )
    return;
  if (tile.status === tileStatuses.marked) {
    tile.status = tileStatuses.hidden;
  } else {
    tile.status = tileStatuses.marked;
  }
}

export function revealTile(board, tile) {
  if (tile.status !== tileStatuses.hidden) return;
  if (tile.mine) {
    tile.status = tileStatuses.mine;
    return;
  }

  tile.status = tileStatuses.number;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter((tile) => tile.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.element.textContent = mines.length;
  }
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === tileStatuses.number ||
        (tile.mine &&
          (tile.status === tileStatuses.hidden ||
            tile.status === tileStatuses.marked))
      );
    });
  });
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === tileStatuses.mine;
    });
  });
}

function getMinePositions(difficultyScalingX, difficultyScalingY, currentTotalMines) {
  const positions = [];

  while (positions.length < currentTotalMines) {
    const position = {
      x: randomNumber(difficultyScalingX),
      y: randomNumber(difficultyScalingY),
    };

    if (!positions.some((p) => positionMatch(p, position))) {
      positions.push(position);
    }
  }

  return positions;
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function nearbyTiles(board, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }

  return tiles;
}
