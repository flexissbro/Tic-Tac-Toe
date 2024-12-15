// Herní stav
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

// Vítězné kombinace (indexy buněk)
const winningConditions = [
    [0, 1, 2], // Horizontální
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Vertikální
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonální
    [2, 4, 6]
];

// DOM elementy
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');

// Přidání event listenerů
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);

// Funkce pro zpracování kliknutí na buňku
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

// Funkce pro aktualizaci stavu hry po tahu
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
}

// Funkce pro kontrolu výsledku
function handleResultValidation() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Vyhrál hráč ${currentPlayer}!`;
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.textContent = 'Remíza!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Na tahu: ${currentPlayer}`;
}

// Funkce pro restart hry
function handleRestartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.textContent = `Na tahu: ${currentPlayer}`;
    cells.forEach(cell => cell.textContent = '');
} 