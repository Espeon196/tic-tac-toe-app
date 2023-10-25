import React, { useState } from 'react';
import Button from '@mui/material/Button';
import {
  Box, 
  Grid, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  ListSubheader, 
  Paper, 
  styled 
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';

import "./App.css"

type SquareType = (string | null);
type SquaresType = SquareType[];

type SquareProps = {
  value: SquareType;
  onSquareClick: () => void;
};
function Square({ value, onSquareClick }: SquareProps) {
  return (
    <Button onClick={onSquareClick} variant='contained'>
      {value ? value : "-"}
    </Button>
  )
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type BoardProps = {
  xIsNext: boolean;
  squares: SquaresType;
  onPlay: (nextSquares: SquaresType) => void;
};
function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className='status'>
        <Item>
          {status}
        </Item>
      </div>
      <div className='board-row'>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className='board-row'>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className='board-row'>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] =useState<SquaresType[]>([Array(9).fill(null)]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquaresType) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(currentMove => currentMove + 1);
  }

  function jumpTo(nextMove: number) {
    setHistory(history => history.slice(0, nextMove+1));
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
        <ListItem key={move}>
          <ListItemButton onClick={() => jumpTo(move)}>
            <ListItemIcon>
              <UndoIcon />
            </ListItemIcon>
            <ListItemText primary={description} />
          </ListItemButton>
        </ListItem>
    );
  });

  return (
    <div className='game'>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </Grid>
        <Grid item xs={4} sx={{ width: '50%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <List
            dense={true} 
            component="nav"
            subheader={
              <ListSubheader component="div">Match history</ListSubheader>
            }
          >
            {moves}
          </List>
        </Grid>
      </Grid>
    </div>
  );
}

function calculateWinner(squares: SquaresType) {
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
    if (squares[a] && squares[a] === squares[b] &&  squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
