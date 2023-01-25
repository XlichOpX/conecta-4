import clsx from "clsx";
import { useState } from "react";
import {
  Player,
  players,
  CellState,
  getInitialGame,
  colors,
} from "../lib/game";
import { Cell } from "./Cell";

const cols = 7;
const rows = 6;
const totalCells = cols * rows;

export function Game() {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(players.yellow);
  const [remainingCells, setRemainingCells] = useState(totalCells);
  const [game, setGame] = useState<CellState[][]>(() =>
    getInitialGame({ cols, rows })
  );

  function handleClick(col: number) {
    if (remainingCells === 0) return;

    const isColFull = game[col][0].color !== colors.none;
    if (isColFull) return;

    addChipToCol(col);
  }

  function togglePlayer() {
    if (currentPlayer === players.yellow) {
      return setCurrentPlayer(players.red);
    }
    setCurrentPlayer(players.yellow);
  }

  function addChipToCol(col: number) {
    const newGame = [...game];
    for (let i = newGame[col].length - 1; i >= 0; i--) {
      const cell = newGame[col][i];
      if (cell.color === colors.none) {
        newGame[col][i] = {
          ...newGame[col][i],
          color: currentPlayer.color,
        };
        break;
      }
    }
    setGame(newGame);
    setRemainingCells(remainingCells - 1);
    togglePlayer();
  }

  function resetGame() {
    setGame(() => getInitialGame({ cols, rows }));
    setRemainingCells(totalCells);
  }

  return (
    <>
      <p aria-live="polite" className="flex items-center gap-2">
        {remainingCells > 0 ? (
          <>
            <span>Turno del jugador: {currentPlayer.name}</span>
            <span
              className={clsx(
                "h-5 w-5 border border-slate-900",
                currentPlayer.color === colors.red && "bg-red-500",
                currentPlayer.color === colors.yellow && "bg-yellow-300"
              )}
            />
          </>
        ) : (
          <span>¡Empate!</span>
        )}
      </p>

      <div className="flex gap-2 rounded bg-slate-700 p-2 shadow-md lg:gap-4 lg:p-4">
        {game.map((col, colIndex) => (
          <button
            key={colIndex}
            className="flex flex-col gap-2"
            onClick={() => handleClick(colIndex)}
          >
            {col.map((cell, rowIndex) => (
              <Cell
                key={"" + colIndex + rowIndex}
                state={cell}
                col={colIndex}
                row={rowIndex}
              />
            ))}
          </button>
        ))}
      </div>

      <button
        className="rounded bg-slate-800 p-2 text-white"
        onClick={resetGame}
      >
        Reiniciar juego
      </button>
    </>
  );
}
