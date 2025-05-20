const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreTexts = document.querySelectorAll(".scores");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const coreElements = document.querySelectorAll(".cores");

const bestScore = localStorage.getItem("bestScore") || 0;
coreElements.forEach(core => core.textContent = bestScore);

const gameWidth = gameBoard.width = 300;
const gameHeight = gameBoard.height = 300;
const boardBackground = "white";
let snakeColor = "black"; // valeur par défaut
const savedSnakeColor = localStorage.getItem("selectedSnakeColor");
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 5;

let running = false;
let isPaused = false;
let moveEvery = 5; // le serpent commence lentement
let tickCount = 0;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX, foodY, score = 0;

let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

if (resetBtn) resetBtn.addEventListener("click", resetGame);
if (savedSnakeColor) {
    snakeColor = savedSnakeColor;
}
gameStart();

window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        togglePause();
    } else {
        changeDirection(event);
    }
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        // Pause automatique : NE PAS toucher à la musique de fond
        if (!isPaused && running) {
            isPaused = true;
            sessionStorage.setItem("autoPaused", "true");
        }
    } else {
        // Reprise automatique : NE PAS toucher à la musique de fond
        if (sessionStorage.getItem("autoPaused") === "true" && isPaused) {
            isPaused = false;
            sessionStorage.removeItem("autoPaused");
            nextTick();
        }
    }
});

// Gestion flèche retour : toujours sauvegarder le score affiché dans le DOM
document.querySelectorAll(".backArrow").forEach(arrow => {
    arrow.addEventListener("click", (event) => {
        event.preventDefault();

        // Toujours récupérer le score affiché dans le DOM (plus fiable si variable score non globale)
        let scoreToSave = 0;
        const scoreEl = document.querySelector(".scores");
        if (scoreEl) {
            scoreToSave = parseInt(scoreEl.textContent, 10) || 0;
        } else if (typeof score !== "undefined") {
            scoreToSave = score;
        }
        localStorage.setItem("lastScore", scoreToSave);

        if (typeof moveEvery !== "undefined") {
            localStorage.setItem("lastSpeed", moveEvery);
        }

        // Redirection selon la flèche cliquée
        const target = arrow.getAttribute("data-target");
        if (target) {
            window.location.href = target;
        }
    });
});

// Gestion du fond du jeux
// Appliquer le fond choisi au chargement et à chaque début de partie
function applySelectedBackground() {
    const savedBackground = localStorage.getItem("selectedBackground");
    const gameBoard = document.getElementById('gameBoard');
if (savedBackground && gameBoard) {
    gameBoard.style.backgroundImage = `url('${savedBackground}')`;
    gameBoard.style.backgroundRepeat = "repeat-x repeat-y";
    gameBoard.style.backgroundSize = "100px";
    gameBoard.style.backgroundPosition = "center";
}
}

// Appliquer le fond au chargement de la page
document.addEventListener("DOMContentLoaded", applySelectedBackground);

function gameStart() {
    running = true;
    score = 0;
    updateScore();
    createFood();
    drawFood();
    applySelectedBackground(); // <-- applique le fond à chaque début de partie
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            tickCount++;
            if (!isPaused && tickCount % moveEvery === 0) {
                moveSnake();
                checkGameOver();
            }
            drawSnake();
            nextTick();
        }, 30);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        return Math.floor((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
    snake.unshift(head);
    if (snake[0].x === foodX && snake[0].y === foodY) {
        // Effet sonore quand le serpent mange la pomme
        const soundEnabled = localStorage.getItem("soundEnabled");
        if (soundEnabled === null || soundEnabled === "true") {
            const eatSound = document.getElementById('eat-sound');
            if (eatSound) {
                eatSound.currentTime = 0;
                eatSound.play().catch(() => {});
            }
        }
        score++;
        updateScore();
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, unitSize, unitSize);
        ctx.strokeRect(part.x, part.y, unitSize, unitSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch (true) {
        case (keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    if (
        snake[0].x < 0 || snake[0].x >= gameWidth ||
        snake[0].y < 0 || snake[0].y >= gameHeight
    ) {
        running = false;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
            break;
        }
    }
}

function displayGameOver() {
    localStorage.setItem("score", score);
    localStorage.setItem("lastScore", score); // Pour cohérence
    const bestScore = localStorage.getItem("bestScore") || 0;
    if (score > bestScore) {
        localStorage.setItem("bestScore", score);
    }
    window.location.href = "indexe4.html";
}

function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    isPaused = false;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
}

function togglePause() {
    if (!running) return;
    isPaused = !isPaused;

    // Contrôle la musique de fond selon le paramètre utilisateur
    const bgMusic = document.getElementById('bg-music');
    const musicEnabled = localStorage.getItem("musicEnabled");
    if (bgMusic) {
        if (isPaused) {
            bgMusic.pause();
        } else if (musicEnabled === null || musicEnabled === "true") {
            bgMusic.play().catch(() => {});
        }
    }

    if (!isPaused) {
        nextTick();
    }
}

function updateScore() {
    scoreTexts.forEach(el => el.textContent = score);
    moveEvery = Math.max(1, 5 - Math.floor(score / 3));
}