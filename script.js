const boardElement = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const messageElement = document.getElementById("game-message");

let board;
let score;
let gameOver;
let won;

function startGame() {
    board = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    gameOver = false;
    won = false;

    messageElement.textContent = "";

    addRandomTile();
    addRandomTile();
    renderBoard();
}

function addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptyCells.push([row, col]);
            }
        }
    }

    if (emptyCells.length === 0) return;

    const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function renderBoard() {
    boardElement.innerHTML = "";

    board.flat().forEach(value => {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.value = value;
        tile.textContent = value === 0 ? "" : value;

        boardElement.appendChild(tile);
    });

    scoreElement.textContent = score;
}

function mergeLine(line) {
    const numbers = line.filter(value => value !== 0);
    const merged = [];

    for (let i = 0; i < numbers.length; i++) {
        if (
            i + 1 < numbers.length &&
            numbers[i] === numbers[i + 1]
        ) {
            const newValue = numbers[i] * 2;
            merged.push(newValue);
            score += newValue;

            if (newValue === 2048) won = true;

            i++;
        } else {
            merged.push(numbers[i]);
        }
    }

    while (merged.length < 4) {
        merged.push(0);
    }

    return merged;
}

function move(direction) {
    if (gameOver) return;

    const oldBoard = JSON.stringify(board);

    for (let i = 0; i < 4; i++) {
        let line;

        if (direction === "left" || direction === "right") {
            line = [...board[i]];
        } else {
            line = board.map(row => row[i]);
        }

        if (direction === "right" || direction === "down") {
            line.reverse();
        }

        line = mergeLine(line);

        if (direction === "right" || direction === "down") {
            line.reverse();
        }

        for (let j = 0; j < 4; j++) {
            if (direction === "left" || direction === "right") {
                board[i][j] = line[j];
            } else {
                board[j][i] = line[j];
            }
        }
    }

    if (JSON.stringify(board) === oldBoard) return;

    addRandomTile();
    renderBoard();

    if (won) {
        messageElement.textContent = "🎉 You reached 2048!";
    }

    if (!canMove()) {
        gameOver = true;
        messageElement.textContent = "Game Over! Try again.";
    }
}

function canMove() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const value = board[row][col];

            if (value === 0) return true;

            if (col < 3 && value === board[row][col + 1]) {
                return true;
            }

            if (row < 3 && value === board[row + 1][col]) {
                return true;
            }
        }
    }

    return false;
}

document.addEventListener("keydown", event => {
    const directions = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"
    };

    const direction = directions[event.key];

    if (direction) {
        event.preventDefault();
        move(direction);
    }
});

document.getElementById("restart").addEventListener("click", startGame);

startGame();