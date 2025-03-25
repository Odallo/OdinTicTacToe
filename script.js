console.log("script loaded successfully");

const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setCell = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, setCell, resetBoard };
})();

// Player Factory
const Player = (name, marker) => {
    return { name, marker };
};

// Game Controller Module
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.displayMessage(`${players[currentPlayerIndex].name}'s turn`);
    };

    const playTurn = (index) => {
        if (gameOver) return;

        const currentPlayer = players[currentPlayerIndex];
        if (Gameboard.setCell(index, currentPlayer.marker)) {
            if (checkWinner(currentPlayer.marker)) {
                DisplayController.displayMessage(`${currentPlayer.name} wins!`);
                gameOver = true;
            } else if (isTie()) {
                DisplayController.displayMessage("It's a tie!");
                gameOver = true;
            } else {
                currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
                DisplayController.displayMessage(`${players[currentPlayerIndex].name}'s turn`);
            }
            DisplayController.renderBoard();
        }
    };

    const checkWinner = (marker) => {
        const board = Gameboard.getBoard();
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]            // Diagonals
        ];

        return winningCombinations.some(combination =>
            combination.every(index => board[index] === marker)
        );
    };

    const isTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    return { startGame, playTurn };
})();

// Display Controller Module
const DisplayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restart");

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => GameController.playTurn(index));
    });

    restartButton.addEventListener("click", () => {
        const player1Name = prompt("Enter Player 1's name:");
        const player2Name = prompt("Enter Player 2's name:");
        GameController.startGame(player1Name || "Player 1", player2Name || "Player 2");
    });

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const displayMessage = (message) => {
        messageElement.textContent = message;
    };

    return { renderBoard, displayMessage };
})();

// Start the game with default players when the page loads
document.addEventListener("DOMContentLoaded", () => {
    GameController.startGame("Player 1", "Player 2");
});