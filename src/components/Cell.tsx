import clsx from "clsx";
import { CellState, colors } from "../lib/game";

export function Cell({
  state,
  row,
  col,
}: {
  state: CellState;
  row: number;
  col: number;
}) {
  return (
    <div
      className={clsx(
        "md:border-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 font-bold sm:h-10 sm:w-10 md:h-16 md:w-16",
        state.color === colors.none &&
          "bg-gradient-to-t from-white/10 to-black/10",
        state.color === colors.yellow && "bg-yellow-300",
        state.color === colors.red && "bg-red-500",
        state.highlight && "ring-2 ring-white"
      )}
    >
      {row}
      {col}
    </div>
  );
}
