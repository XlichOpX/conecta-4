import { useState } from "react";
import {
  CellState,
  checkForConnect,
  cloneGame,
  colors,
  getInitialGame,
  Player,
  players,
} from "../lib/game";
import { Cell } from "./Cell";
import { PlayerAvatar } from "./PlayerAvatar";

const cols = 7;
const rows = 6;
const totalCells = cols * rows;
const cellsToConnect = 4;

export function Game() {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(players.yellow);
  const [remainingCells, setRemainingCells] = useState(totalCells);
  const [game, setGame] = useState<CellState[][]>(() =>
    getInitialGame({ cols, rows })
  );

  const [winner, setWinner] = useState<Player | null>(null);

  function handleClick(col: number) {
    if (remainingCells === 0 || winner) return;

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
    const newGame = cloneGame(game);

    let changedCell = { col, row: rows - 1, color: currentPlayer.color };
    for (let i = newGame[col].length - 1; i >= 0; i--) {
      const cell = newGame[col][i];
      if (cell.color === colors.none) {
        newGame[col][i] = {
          ...newGame[col][i],
          color: currentPlayer.color,
        };
        changedCell = { col, row: i, color: currentPlayer.color };
        break;
      }
    }

    const finishedGame = checkForConnect({
      changedCell,
      rows,
      cellsToConnect,
      game: newGame,
    });

    if (finishedGame) {
      setWinner(currentPlayer);
    }

    setGame(finishedGame || newGame);
    setRemainingCells(remainingCells - 1);
    togglePlayer();
  }

  function resetGame() {
    setGame(() => getInitialGame({ cols, rows }));
    setRemainingCells(totalCells);
    setWinner(null);
  }

  return (
    <>
      <p aria-live="polite" className="flex items-center gap-2">
        {!winner && remainingCells > 0 && (
          <span>
            Turno del jugador: <PlayerAvatar player={currentPlayer} />
          </span>
        )}

        {!winner && remainingCells === 0 && <span>¡Empate!</span>}

        {winner && (
          <span>
            ¡Ha ganado el jugador: <PlayerAvatar player={winner} />!
          </span>
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
