const p1Board = document.getElementById('p1-board');
const p2Board = document.getElementById('p2-board');
const statusText = document.getElementById('status');
const actionBtn = document.getElementById('action-btn');
const overlay = document.getElementById('overlay');

let currentPlayer = 1;
let gameState = 'p1-setup'; 
let p1Ships = [];
let p2Ships = [];

// 1. Initialize Grids
function createGrid(boardElement, playerNum) {
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(playerNum, i, cell));
        boardElement.appendChild(cell);
    }
}

// 2. Handle Clicks (Placement & Attacking)
function handleCellClick(playerNum, index, cell) {
    if (gameState === 'p1-setup' && playerNum === 1) {
        cell.classList.toggle('ship');
    } else if (gameState === 'p2-setup' && playerNum === 2) {
        cell.classList.toggle('ship');
    } else if (gameState === 'p1-attack' && playerNum === 2) {
        bombCell(cell, p2Ships);
    } else if (gameState === 'p2-attack' && playerNum === 1) {
        bombCell(cell, p1Ships);
    }
}

function bombCell(cell, enemyShips) {
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;

    if (cell.classList.contains('ship')) {
        cell.classList.add('hit');
        statusText.innerText = "HIT! Go again.";
    } else {
        cell.classList.add('miss');
        nextTurn();
    }
}

// 3. Turn Logic
actionBtn.addEventListener('click', () => {
    if (gameState === 'p1-setup') {
        p1Ships = Array.from(p1Board.querySelectorAll('.ship')).map(c => c.dataset.index);
        hideShips(p1Board);
        gameState = 'p2-setup';
        statusText.innerText = "Player 2: Place your ships";
    } else if (gameState === 'p2-setup') {
        p2Ships = Array.from(p2Board.querySelectorAll('.ship')).map(c => c.dataset.index);
        hideShips(p2Board);
        startCombat();
    }
});

function nextTurn() {
    overlay.classList.remove('hidden');
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    gameState = currentPlayer === 1 ? 'p1-attack' : 'p2-attack';
    statusText.innerText = `Player ${currentPlayer}'s Turn to Attack`;
}

function revealBoard() {
    overlay.classList.add('hidden');
    p1Board.parentElement.classList.toggle('disabled', currentPlayer === 2);
    p2Board.parentElement.classList.toggle('disabled', currentPlayer === 1);
}

function hideShips(board) {
    board.querySelectorAll('.ship').forEach(c => c.classList.remove('ship'));
}

function startCombat() {
    actionBtn.classList.add('hidden');
    nextTurn();
}

createGrid(p1Board, 1);
createGrid(p2Board, 2);
p2Board.parentElement.classList.add('disabled');