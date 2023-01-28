export const colors = {
  yellow: "yellow",
  red: "red",
  none: "none",
} as const;

export const players = {
  yellow: { name: "Amarillo", color: colors.yellow },
  red: { name: "Rojo", color: colors.red },
};

export type Color = keyof typeof colors;
export type Player = { name: string; color: Exclude<Color, "none"> };
export type CellState = { color: Color; highlight: boolean };
export type Game = ReturnType<typeof getInitialGame>;
export type CellPosition = { col: number; row: number };

export function getInitialGame({ cols, rows }: { cols: number; rows: number }) {
  const initialGame: CellState[][] = [];
  for (let i = 0; i < cols; i++) {
    initialGame.push(
      Array.from<CellState>({ length: rows }).fill({
        color: colors.none,
        highlight: false,
      })
    );
  }
  return initialGame;
}

export function cloneGame(game: Game) {
  const clonedGame = [];
  for (const col of game) {
    clonedGame.push([...col]);
  }
  return clonedGame;
}

export function getNextChipPosition({
  col,
  game,
}: {
  col: number;
  game: Game;
}) {
  for (let row = game[col].length - 1; row >= 0; row--) {
    const cell = game[col][row];
    if (cell.color === colors.none) {
      return [col, row] as const;
    }
  }
}

export function addChipToCol({
  col: targetCol,
  game,
  color,
}: {
  col: number;
  game: Game;
  color: Color;
}) {
  const nextChipPosition = getNextChipPosition({ col: targetCol, game });
  if (!nextChipPosition) throw new Error("Couldn't get next chip position");

  const [col, row] = nextChipPosition;

  game[col][row] = {
    ...game[col][row],
    color,
  };

  return { ...game[col][row], col, row };
}

export function checkForConnect({
  changedCell,
  cellsToConnect,
  game,
}: {
  changedCell: CellPosition & { color: Color };
  cellsToConnect: number;
  game: Game;
}) {
  const rows = game[0].length;
  const cols = game.length;
  let connectedCells: CellPosition[] = [];

  if (
    checkVerticalAxis() ||
    checkHorizontalAxis() ||
    checkTopToBottomDiagonalAxis() ||
    checkBottomToTopDiagonalAxis()
  ) {
    highlightConnectedCells();
    return game;
  }

  return false;

  function checkVerticalAxis() {
    const couldConnectVertical = changedCell.row <= rows - cellsToConnect;
    if (!couldConnectVertical) return false;

    for (let i = changedCell.row; i < game[changedCell.col].length; i++) {
      const cell = game[changedCell.col][i];
      if (cell.color === changedCell.color) {
        connectedCells.push({ col: changedCell.col, row: i });
        if (connectedCells.length === cellsToConnect) return true;
        continue;
      }

      connectedCells = [];
      break;
    }

    return false;
  }

  function checkHorizontalAxis() {
    connectedCells = [];
    for (let i = 0; i < cols; i++) {
      const cell = game[i][changedCell.row];
      if (cell.color === changedCell.color) {
        connectedCells.push({ col: i, row: changedCell.row });
        if (connectedCells.length === cellsToConnect) return true;
        continue;
      }

      connectedCells = [];
    }

    return false;
  }

  function checkTopToBottomDiagonalAxis() {
    connectedCells = [];
    const cellDiff = changedCell.row - changedCell.col;
    const diagonalStartCell = {
      col: cellDiff >= 0 ? 0 : Math.abs(cellDiff),
      row: cellDiff >= 0 ? cellDiff : 0,
    };

    for (
      let c = diagonalStartCell.col, r = diagonalStartCell.row;
      c < cols && r < rows;
      c++, r++
    ) {
      const cell = game[c][r];
      if (cell.color === changedCell.color) {
        connectedCells.push({ col: c, row: r });
        if (connectedCells.length === cellsToConnect) return true;
        continue;
      }

      connectedCells = [];
    }

    return false;
  }

  function checkBottomToTopDiagonalAxis() {
    connectedCells = [];
    const cellSum = changedCell.row + changedCell.col;
    const diagonalStartCell = {
      col: cellSum >= cols ? cols - 1 : cellSum,
      row: cellSum - (cols - 1) >= 0 ? cellSum - (cols - 1) : 0,
    };

    for (
      let c = diagonalStartCell.col, r = diagonalStartCell.row;
      c >= 0 && r < rows;
      c--, r++
    ) {
      const cell = game[c][r];
      if (cell.color === changedCell.color) {
        connectedCells.push({ col: c, row: r });
        if (connectedCells.length === cellsToConnect) return true;
        continue;
      }

      connectedCells = [];
    }

    return false;
  }

  function highlightConnectedCells() {
    connectedCells.forEach(
      (cell) =>
        (game[cell.col][cell.row] = {
          ...game[cell.col][cell.row],
          highlight: true,
        })
    );
  }
}
