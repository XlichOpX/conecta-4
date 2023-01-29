import { clsx } from "clsx";
import { colors, Player } from "../lib/game";

export function PlayerAvatar({ player, reverse = false }: { player: Player; reverse?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2", reverse && "flex-row-reverse")}>
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
