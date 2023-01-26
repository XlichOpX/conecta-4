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

export function checkVerticalAxis({
  changedCell,
  game,
  cellsToConnect,
  checkedColor,
}: {
  changedCell: CellPosition;
  game: Game;
  cellsToConnect: number;
  checkedColor: Color;
}) {
  const { col, row } = changedCell;
  const connectedCells: CellPosition[] = [];

  for (let i = row; i < game[col].length; i++) {
    if (connectedCells.length === cellsToConnect) break;

    const cell = game[changedCell.col][i];
    if (cell.color === checkedColor) {
      connectedCells.push({ col: changedCell.col, row: i });
      continue;
    }

    return false;
  }

  return connectedCells;
}

export function checkForConnect({
  changedCell,
  rows,
  cellsToConnect,
  game,
}: {
  changedCell: CellPosition & { color: Color };
  rows: number;
  cellsToConnect: number;
  game: Game;
}) {
  const couldConnectVertical = changedCell.row <= rows - cellsToConnect;
  if (couldConnectVertical) {
    const connectedVertical = checkVerticalAxis({
      cellsToConnect,
      changedCell,
      checkedColor: changedCell.color,
      game,
    });

    if (connectedVertical) {
      connectedVertical.forEach(
        (cell) =>
          (game[cell.col][cell.row] = {
            ...game[cell.col][cell.row],
            highlight: true,
          })
      );
      return game;
    }
  }

  return false;
}
