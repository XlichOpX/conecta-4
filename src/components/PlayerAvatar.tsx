import { clsx } from "clsx";
import { colors, Player } from "../lib/game";

export function PlayerAvatar({ player }: { player: Player }) {
  return (
    <span className="inline-flex items-center gap-2">
      {player.name}
      <span
        className={clsx(
          "h-5 w-5 border border-slate-900",
          player.color === colors.red && "bg-red-500",
          player.color === colors.yellow && "bg-yellow-300"
        )}
      />
    </span>
  );
}
