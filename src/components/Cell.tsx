import clsx from "clsx";
import { CellState, Color, colors } from "../lib/game";

export function Cell({
  state,
  hint = false,
  currentPlayerColor,
}: {
  state: CellState;
  row: number;
  col: number;
  hint?: boolean;
  currentPlayerColor: Color;
}) {
  return (
    <div
      className={clsx(
        "md:border-3 flex h-8 w-8 items-center justify-center rounded-full font-bold text-white transition-all duration-150 ease-in sm:h-10 sm:w-10 md:h-16 md:w-16",
        !state.highlight && "border-2 border-slate-300",
        state.color === colors.none && "bg-gradient-to-t from-white/10 to-black/10",
        state.color === colors.yellow && "bg-yellow-300",
        state.color === colors.red && "bg-red-500",
        state.highlight && "ring-2 ring-white lg:ring-4",
        hint && currentPlayerColor === "red" && "group-hover:bg-red-500/50",
        hint && currentPlayerColor === "yellow" && "group-hover:bg-yellow-300/50"
      )}
    ></div>
  );
}
