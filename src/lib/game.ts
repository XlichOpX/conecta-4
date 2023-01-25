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
