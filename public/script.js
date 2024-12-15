// Připojení k Socket.IO serveru
const socket = io();

// Herní proměnné
let playerSymbol = '';
let currentRoom = '';
let isMyTurn = false;

// DOM elementy
const joinForm = document.getElementById('joinForm');
const waitingScreen = document.getElementById('waitingScreen');
const gameScreen = document.getElementById('gameScreen');
const roomInput = document.getElementById('roomId');
const roomCode = document.getElementById('roomCode');
const joinButton = document.getElementById('joinButton');
const createButton = document.getElementById('createButton');
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('[data-cell]');
const restartButton = document.getElementById('restartButton');

// Generování náhodného kódu místnosti
function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Event listeners pro tlačítka
createButton.addEventListener('click', () => {
    const roomId = generateRoomId();
    socket.emit('joinGame', roomId);
    currentRoom = roomId;
    showWaitingScreen(roomId);
});

joinButton.addEventListener('click', () => {
    const roomId = roomInput.value.toUpperCase();
    if (roomId.length === 6) {
        socket.emit('joinGame', roomId);
        currentRoom = roomId;
    } else {
        alert('Zadejte platný kód místnosti (6 znaků)');
    }
});

// Přidání event listenerů na herní pole
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', () => {
    socket.emit('restartGame', currentRoom);
});

// Funkce pro zpracování kliknutí na pole
function handleCellClick(e) {
    if (!isMyTurn) return;
    
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);
    
    if (cell.textContent === '') {
        socket.emit('makeMove', { roomId: currentRoom, index: index });
    }
}

// Socket.IO event handlers
socket.on('playerAssignment', ({ symbol, roomId }) => {
    playerSymbol = symbol;
    currentRoom = roomId;
    showWaitingScreen(roomId);
});

socket.on('gameStart', () => {
    showGameScreen();
    isMyTurn = playerSymbol === 'X';
    updateStatus();
});

socket.on('updateGame', ({ gameState, currentPlayer }) => {
    updateBoard(gameState);
    isMyTurn = socket.id === currentPlayer;
    updateStatus();
});

socket.on('gameOver', ({ winner, gameState }) => {
    // Nejprve aktualizujeme herní plochu
    updateBoard(gameState);
    
    // Pak zobrazíme výsledek
    if (winner === null) {
        statusDisplay.textContent = 'Remíza!';
    } else {
        statusDisplay.textContent = winner === socket.id ? 'Vyhráli jste!' : 'Prohráli jste!';
    }
    restartButton.classList.remove('hidden');
});

socket.on('gameRestarted', ({ gameState, currentPlayer }) => {
    updateBoard(gameState);
    isMyTurn = socket.id === currentPlayer;
    updateStatus();
    restartButton.classList.add('hidden');
});

socket.on('playerDisconnected', () => {
    alert('Protihráč se odpojil!');
    resetGame();
});

socket.on('roomFull', () => {
    alert('Místnost je plná!');
    resetGame();
});

// Pomocné funkce
function showWaitingScreen(roomId) {
    joinForm.classList.add('hidden');
    waitingScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    roomCode.textContent = roomId;
}

function showGameScreen() {
    waitingScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

function updateBoard(gameState) {
    cells.forEach((cell, index) => {
        cell.textContent = gameState[index];
    });
}

function updateStatus() {
    statusDisplay.textContent = isMyTurn ? 'Jste na tahu!' : 'Soupeř je na tahu...';
}

function resetGame() {
    joinForm.classList.remove('hidden');
    waitingScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    roomInput.value = '';
    cells.forEach(cell => cell.textContent = '');
    restartButton.classList.add('hidden');
} 