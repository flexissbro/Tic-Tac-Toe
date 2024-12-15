const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Servírování statických souborů
app.use(express.static('public'));

// Herní pokoje a jejich stav
const gameRooms = new Map();

io.on('connection', (socket) => {
    console.log('Hráč se připojil:', socket.id);

    // Připojení do hry
    socket.on('joinGame', (roomId) => {
        // Pokud pokoj neexistuje, vytvoříme nový
        if (!gameRooms.has(roomId)) {
            gameRooms.set(roomId, {
                players: [socket.id],
                currentPlayer: socket.id,
                gameState: ['', '', '', '', '', '', '', '', ''],
                gameActive: true
            });
            socket.join(roomId);
            socket.emit('playerAssignment', { symbol: 'X', roomId });
        } 
        // Pokud pokoj existuje a má místo
        else if (gameRooms.get(roomId).players.length === 1) {
            const room = gameRooms.get(roomId);
            room.players.push(socket.id);
            socket.join(roomId);
            socket.emit('playerAssignment', { symbol: 'O', roomId });
            io.to(roomId).emit('gameStart');
        } 
        // Pokud je pokoj plný
        else {
            socket.emit('roomFull');
        }
    });

    // Zpracování tahu
    socket.on('makeMove', ({ roomId, index }) => {
        const room = gameRooms.get(roomId);
        if (!room || !room.gameActive || room.currentPlayer !== socket.id) return;

        const symbol = room.players[0] === socket.id ? 'X' : 'O';
        room.gameState[index] = symbol;

        // Nejprve aktualizujeme stav hry pro všechny hráče
        io.to(roomId).emit('updateGame', {
            gameState: room.gameState,
            currentPlayer: room.currentPlayer
        });
        
        // Pak zkontrolujeme výhru
        if (checkWinner(room.gameState, symbol)) {
            room.gameActive = false;
            io.to(roomId).emit('gameOver', { winner: socket.id, gameState: room.gameState });
        } 
        // Kontrola remízy
        else if (!room.gameState.includes('')) {
            room.gameActive = false;
            io.to(roomId).emit('gameOver', { winner: null, gameState: room.gameState });
        } 
        // Pokračování hry
        else {
            room.currentPlayer = room.players.find(id => id !== socket.id);
            io.to(roomId).emit('updateGame', {
                gameState: room.gameState,
                currentPlayer: room.currentPlayer
            });
        }
    });

    // Restart hry
    socket.on('restartGame', (roomId) => {
        const room = gameRooms.get(roomId);
        if (room) {
            room.gameState = ['', '', '', '', '', '', '', '', ''];
            room.gameActive = true;
            room.currentPlayer = room.players[0];
            io.to(roomId).emit('gameRestarted', {
                gameState: room.gameState,
                currentPlayer: room.currentPlayer
            });
        }
    });

    // Odpojení hráče
    socket.on('disconnect', () => {
        console.log('Hráč se odpojil:', socket.id);
        gameRooms.forEach((room, roomId) => {
            if (room.players.includes(socket.id)) {
                io.to(roomId).emit('playerDisconnected');
                gameRooms.delete(roomId);
            }
        });
    });
});

// Kontrola výhry
function checkWinner(gameState, symbol) {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontální
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertikální
        [0, 4, 8], [2, 4, 6] // diagonální
    ];

    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === symbol);
    });
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
}); 