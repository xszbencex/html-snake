const RESOLUTION = 20;
const CANVAS_WIDTH = 20;
const CANVAS_HEIGHT = 20;

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;
const startGameButton = document.getElementById('start-game-button') as HTMLButtonElement;

let snakeX = 0;
let snakeY = 0;
let appleX = 0;
let appleY = 0;
let direction: Direction = 'RIGHT';

let gameIntervalId: number = NaN;

canvas.width = CANVAS_WIDTH * RESOLUTION;
canvas.height = CANVAS_HEIGHT * RESOLUTION;

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  context.beginPath();
  context.rect(snakeX * RESOLUTION, snakeY * RESOLUTION, RESOLUTION, RESOLUTION);
  context.fillStyle = 'green';
  context.fill();
  context.closePath();
}

function drawApple() {
  context.beginPath();
  context.arc(appleX * RESOLUTION + RESOLUTION / 2, appleY * RESOLUTION + RESOLUTION / 2, RESOLUTION / 2, 0, Math.PI * 2, false);
  context.fillStyle = 'red';
  context.fill();
  context.closePath();
}

function moveSnake() {
  switch (direction) {
    case 'UP':
      snakeY -= 1;
      break;
    case 'DOWN':
      snakeY += 1;
      break;
    case 'RIGHT':
      snakeX += 1;
      break;
    case 'LEFT':
      snakeX -= 1;
      break;
  }
}

function placeApple() {
  appleX = randomIntFromInterval(0, CANVAS_WIDTH - 1);
  appleY = randomIntFromInterval(0, CANVAS_HEIGHT - 1);
}

function placeSnake() {
  appleX = randomIntFromInterval(0, CANVAS_WIDTH - 1);
  appleY = randomIntFromInterval(0, CANVAS_HEIGHT - 1);
}

function draw() {
  clearCanvas();

  drawSnake();
  drawApple();

  moveSnake();
}

function startGame() {
  placeSnake();
  placeApple();
  draw();
  gameIntervalId = setInterval(() => draw(), 150);
}

startGameButton.addEventListener('click', function () {
  startGame();
  this.disabled = true;
});

document.addEventListener('keydown', keyDownHandler, false);

function keyDownHandler(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowRight':
      direction = 'RIGHT';
      break;
    case 'ArrowLeft':
      direction = 'LEFT';
      break;
    case 'ArrowDown':
      direction = 'DOWN';
      break;
    case 'ArrowUp':
      direction = 'UP';
      break;
  }
}

// TODO random.util.ts-be
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
