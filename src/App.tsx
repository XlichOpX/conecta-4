import { clsx } from "clsx";
import { useState } from "react";

const EMPTY = 0;
const YELLOW = 1;
const RED = 2;

const COLS = 7;
const ROWS = 6;
const TOTAL_CELLS = COLS * ROWS;

function getInitialGame() {
  const initialGame: State[][] = [];
  for (let i = 0; i < COLS; i++) {
    initialGame.push(Array.from<State>({ length: ROWS }).fill(EMPTY));
  }
  return initialGame;
}

const playerNames = {
  [YELLOW]: "Amarillo",
  [RED]: "Rojo",
};

type Player = 1 | 2;
type State = 0 | Player;

function App() {
  const [currentPlayer, setCurrentPlayer] = useState<Player>(YELLOW);
  const [remainingCells, setRemainingCells] = useState(TOTAL_CELLS);
  const [game, setGame] = useState<State[][]>(getInitialGame);

  function handleClick(col: number) {
    if (remainingCells === 0) return;

    const isColFull = game[col][0] !== EMPTY;
    if (isColFull) return;

    addChipToCol(col);
  }

  function togglePlayer() {
    if (currentPlayer === YELLOW) {
      return setCurrentPlayer(RED);
    }
    setCurrentPlayer(YELLOW);
  }

  function addChipToCol(col: number) {
    const newGame = [...game];
    for (let i = newGame[col].length - 1; i >= 0; i--) {
      const cell = newGame[col][i];
      if (cell === EMPTY) {
        newGame[col][i] = currentPlayer;
        break;
      }
    }
    setGame(newGame);
    setRemainingCells(remainingCells - 1);
    togglePlayer();
  }

  function resetGame() {
    setGame(getInitialGame);
    setRemainingCells(TOTAL_CELLS);
  }

  return (
    <div className="h-screen bg-slate-50 text-slate-900">
      <div className="container mx-auto flex h-full flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Conecta 4</h1>

        <p aria-live="polite" className="flex items-center gap-2">
          {remainingCells > 0 ? (
            <>
              <span>Turno del jugador: {playerNames[currentPlayer]}</span>
              <span
                className={clsx(
                  "h-5 w-5 border border-slate-900",
                  currentPlayer === RED && "bg-red-500",
                  currentPlayer === YELLOW && "bg-yellow-300"
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
      </div>
    </div>
  );
}

export default App;

function Cell({ state, row, col }: { state: State; row: number; col: number }) {
  return (
    <div
      className={clsx(
        "md:border-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 font-bold sm:h-10 sm:w-10 md:h-16 md:w-16",
        state === EMPTY && "bg-gradient-to-t from-white/10 to-black/10",
        state === YELLOW && "bg-yellow-300",
        state === RED && "bg-red-500"
      )}
    >
      {row}
      {col}
    </div>
  );
}
