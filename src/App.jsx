import { useState } from "react";

function Square({ value, onSquareClick, isHighlighted = false }) {
  return (
    <button
      className={`square ${isHighlighted ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner?.length > 0) {
    status = "Winner: " + squares[winner[0]];
  } else if (winner?.length == 0) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let boards = [];
  const length = Math.sqrt(squares.length);
  for (let i = 0; i < length; i++) {
    let row = [];
    for (let j = 0; j < length; j++) {
      row.push(
        <Square
          isHighlighted={winner && winner.includes(i * length + j)}
          key={i * length + j}
          value={squares[i * length + j]}
          onSquareClick={() => handleClick(i * length + j)}
        />
      );
    }
    boards.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boards}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  function handleSortHistory() {
    setSortAscending(!sortAscending);
  }

  const moves = history.map((squares, move) => {
    console.log(squares);
    let description;
    if (move > 0) {
      const index = history[move].findIndex(
        (value, i) => history[move - 1][i] == null && value != null
      );
      console.log(index);
      description = `Go to move #${move} - position: (${
        Math.floor(index / 3) + 1
      }, ${Math.floor(index % 3) + 1})`;
    } else if (move == 0) {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        {currentMove != move && (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
        {currentMove == move && <span>{"You are at move #" + move}</span>}
      </li>
    );
  });

  if (!sortAscending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
        <button onClick={handleSortHistory}>
          Sort {sortAscending ? "Descending" : "Ascending"}
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }

  if (squares.every((square) => square != null)) {
    return [];
  }
  return null;
}
