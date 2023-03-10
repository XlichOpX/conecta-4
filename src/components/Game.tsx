import { useRef, useState } from "react";
import {
  addChipToCol,
  CellPosition,
  CellState,
  checkForConnect,
  cloneGame,
  colors,
  getInitialGame,
  getNextChipPosition,
  Player,
  players,
} from "../lib/game";
import { Cell } from "./Cell";
import { PlayerAvatar } from "./PlayerAvatar";
import moveAudio from "../assets/sounds/move.wav";
import winAudio from "../assets/sounds/win.wav";
import confetti from "canvas-confetti";
import { ResetScoreIcon } from "./ResetScoreIcon";
import { ResetGameIcon } from "./ResetGameIcon";

const cols = 7;
const rows = 6;
const totalCells = cols * rows;
const cellsToConnect = 4;

export function Game() {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(players.red);
  const lastPlayer = useRef<Player>(players.red);
  const [remainingCells, setRemainingCells] = useState(totalCells);
  const [game, setGame] = useState<CellState[][]>(() => getInitialGame({ cols, rows }));
  const [scores, setScores] = useState({ yellow: 0, red: 0 });
  const [hintedCell, setHintedCell] = useState<CellPosition | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const moveAudioRef = useRef<HTMLAudioElement>(null);
  const winAudioRef = useRef<HTMLAudioElement>(null);

  function handleClick(col: number) {
    if (remainingCells === 0 || winner) return;

    const isColFull = game[col][0].color !== colors.none;
    if (isColFull) return;

    addChip(col);

    if (moveAudioRef.current) {
      moveAudioRef.current.currentTime = 0;
      moveAudioRef.current.play();
    }
  }

  function togglePlayer() {
    if (currentPlayer === players.yellow) {
      return setCurrentPlayer(players.red);
    }
    setCurrentPlayer(players.yellow);
  }

  function addChip(col: number) {
    const newGame = cloneGame(game);

    const changedCell = addChipToCol({
      col,
      game: newGame,
      color: currentPlayer.color,
    });

    const finishedGame = checkForConnect({
      changedCell,
      cellsToConnect,
      game: newGame,
    });

    if (finishedGame) {
      setWinner(currentPlayer);
      setScores({
        ...scores,
        [currentPlayer.color]: scores[currentPlayer.color] + 1,
      });
      winAudioRef.current?.play();
      confetti({ particleCount: 150, spread: 80 });
    }

    setGame(finishedGame || newGame);
    setRemainingCells(remainingCells - 1);
    togglePlayer();
    setHintedCell({ col, row: changedCell.row - 1 });
  }

  function resetGame() {
    setGame(() => getInitialGame({ cols, rows }));
    setRemainingCells(totalCells);
    setWinner(null);
    if (lastPlayer.current === players.yellow) {
      setCurrentPlayer(players.red);
      lastPlayer.current = players.red;
    } else {
      setCurrentPlayer(players.yellow);
      lastPlayer.current = players.yellow;
    }
  }

  function resetScores() {
    setScores({ red: 0, yellow: 0 });
  }

  function hintNextChip(targetCol: number) {
    const nextChipPosition = getNextChipPosition({ col: targetCol, game });
    if (!nextChipPosition) return;
    const [col, row] = nextChipPosition;
    setHintedCell({ col, row });
  }

  return (
    <>
      <div className="flex w-auto flex-col gap-3">
        <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
          <div>
            <h1 className="mb-2 text-center text-3xl font-bold lg:text-left">Conecta 4</h1>
            <p aria-live="polite" className="flex items-center gap-2">
              {!winner && remainingCells > 0 && (
                <span>
                  Turno del jugador: <PlayerAvatar player={currentPlayer} />
                </span>
              )}

              {!winner && remainingCells === 0 && <span>??Empate!</span>}

              {winner && (
                <span>
                  ??Ha ganado el jugador: <PlayerAvatar player={winner} />!
                </span>
              )}
            </p>
          </div>

          <div aria-live="polite" className="flex flex-col gap-1">
            <h2 className="text-center font-bold lg:text-left">Marcador</h2>
            <p className="flex items-center">
              <PlayerAvatar player={players.yellow} reverse />: {scores.yellow}
            </p>
            <p className="flex items-center">
              <PlayerAvatar player={players.red} reverse />: {scores.red}
            </p>
          </div>
        </div>

        <div className="flex gap-2 rounded bg-slate-700 p-2 shadow-md lg:gap-4 lg:p-4">
          {game.map((col, colIndex) => (
            <button
              key={colIndex}
              className="group flex flex-col gap-2 lg:gap-4"
              onClick={() => handleClick(colIndex)}
              onMouseEnter={() => hintNextChip(colIndex)}
              onMouseLeave={() => setHintedCell(null)}
            >
              {col.map((cell, rowIndex) => (
                <Cell
                  key={"" + colIndex + rowIndex}
                  state={cell}
                  col={colIndex}
                  row={rowIndex}
                  hint={!winner && hintedCell?.col === colIndex && hintedCell.row === rowIndex}
                  currentPlayerColor={currentPlayer.color}
                />
              ))}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className="rounded-md bg-slate-800 p-2 text-white hover:bg-slate-700 active:scale-95 disabled:cursor-not-allowed"
            onClick={resetGame}
            disabled={remainingCells === totalCells}
            title="Reiniciar juego"
          >
            <ResetGameIcon className="h-6 w-6 lg:h-10 lg:w-10" />
          </button>

          <button
            className="rounded-md bg-slate-800 p-2 text-white hover:bg-slate-700 active:scale-95"
            onClick={resetScores}
            title="Reiniciar marcador"
          >
            <ResetScoreIcon className="h-6 w-6 lg:h-10 lg:w-10" />
          </button>
        </div>

        <audio src={moveAudio} ref={moveAudioRef} preload="auto"></audio>
        <audio src={winAudio} ref={winAudioRef} preload="auto"></audio>
      </div>
    </>
  );
}
