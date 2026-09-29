const cells = [...document.querySelectorAll('.cell')];
const board = document.querySelector('#board');
const statusMessage = document.querySelector('#status-message');
const statusDot = document.querySelector('#status-dot');
const roundCount = document.querySelector('#round-count');
const winningLine = document.querySelector('#winning-line');
const scoreCards = { X: document.querySelector('#score-x'), O: document.querySelector('#score-o') };
const scoreValues = { X: document.querySelector('#score-value-x'), O: document.querySelector('#score-value-o') };
const newGameButton = document.querySelector('#new-game');
const headerResetButton = document.querySelector('#reset-header');

const winningPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const linePositions = [
  { left: '6%', top: '16.66%', width: '88%', rotate: '0deg' },
  { left: '6%', top: '50%', width: '88%', rotate: '0deg' },
  { left: '6%', top: '83.33%', width: '88%', rotate: '0deg' },
  { left: '16.66%', top: '6%', width: '88%', rotate: '90deg' },
  { left: '50%', top: '6%', width: '88%', rotate: '90deg' },
  { left: '83.33%', top: '6%', width: '88%', rotate: '90deg' },
  { left: '8%', top: '8%', width: '119%', rotate: '45deg' },
  { left: '92%', top: '8%', width: '119%', rotate: '135deg' },
];

let boardState = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;
let round = 0;
let scores = { X: 0, O: 0 };

function playerName(player) {
  return player === 'X' ? 'Jugador 1' : 'Jugador 2';
}

function setTurnState() {
  statusMessage.textContent = `Turno de ${playerName(currentPlayer)}`;
  statusDot.className = `status-dot${currentPlayer === 'O' ? ' is-o' : ''}`;
  scoreCards.X.classList.toggle('is-active', currentPlayer === 'X' && !gameOver);
  scoreCards.O.classList.toggle('is-active', currentPlayer === 'O' && !gameOver);
}

function updateScoreboard() {
  scoreValues.X.textContent = scores.X;
  scoreValues.O.textContent = scores.O;
}

function clearWinningLine() {
  winningLine.className = 'winning-line';
  winningLine.style.cssText = '';
}

function drawWinningLine(pattern, player) {
  const position = linePositions[winningPatterns.findIndex((item) => item === pattern)];
  winningLine.className = `winning-line visible${player === 'O' ? ' is-o' : ''}`;
  winningLine.style.left = position.left;
  winningLine.style.top = position.top;
  winningLine.style.width = position.width;
  winningLine.style.transform = `rotate(${position.rotate})`;
}

function getWinner() {
  for (const pattern of winningPatterns) {
    const [a, b, c] = pattern;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return { player: boardState[a], pattern };
    }
  }
  return null;
}

function finishGame(winner) {
  gameOver = true;
  cells.forEach((cell) => { cell.disabled = true; });

  if (winner) {
    scores[winner.player] += 1;
    updateScoreboard();
    winner.pattern.forEach((index) => cells[index].classList.add('win'));
    drawWinningLine(winner.pattern, winner.player);
    statusMessage.textContent = `¡Ganó ${playerName(winner.player)}!`;
    statusDot.className = `status-dot${winner.player === 'O' ? ' is-o' : ''}`;
  } else {
    cells.forEach((cell) => cell.classList.add('draw'));
    statusMessage.textContent = 'Empate, tablero completo';
    statusDot.className = 'status-dot is-draw';
  }

  scoreCards.X.classList.remove('is-active');
  scoreCards.O.classList.remove('is-active');
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);
  if (gameOver || boardState[index]) return;

  boardState[index] = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.disabled = true;
  const row = Math.floor(index / 3) + 1;
  const column = (index % 3) + 1;
  cell.setAttribute('aria-label', `Fila ${row}, columna ${column}, ${currentPlayer}`);

  const winner = getWinner();
  if (winner || boardState.every(Boolean)) {
    finishGame(winner);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setTurnState();
}

function resetRound() {
  boardState = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  round += 1;
  roundCount.textContent = `Ronda ${round}`;
  clearWinningLine();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    cell.className = 'cell';
    cell.disabled = false;
    cell.setAttribute('aria-label', `Fila ${row}, columna ${column}, vacía`);
  });
  setTurnState();
}

function resetMatch() {
  scores = { X: 0, O: 0 };
  round = 0;
  updateScoreboard();
  resetRound();
}

cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
newGameButton.addEventListener('click', resetRound);
headerResetButton.addEventListener('click', resetMatch);
updateScoreboard();
resetRound();
