import { DIRECTION_KEYS, OPPOSITE_DIRECTION } from './constants/direction.constant';
import './style.css';
import { Direction } from './types/direction.type';
import { randomIntFromInterval } from './utils/random.util';

const RESOLUTION = 20;
const CANVAS_WIDTH = 20;
const CANVAS_HEIGHT = 20;
const SNAKE_START_PLACEMENT_THRESHOLD = 4;

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
  snakeX = randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, CANVAS_WIDTH - 1 - SNAKE_START_PLACEMENT_THRESHOLD);
  snakeY = randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, CANVAS_HEIGHT - 1 - SNAKE_START_PLACEMENT_THRESHOLD);
}

function checkGameOver() {
  const isGameOver = snakeX >= CANVAS_WIDTH || snakeX < 0 || snakeY >= CANVAS_HEIGHT || snakeY < 0;

  if (isGameOver && gameIntervalId) {
    clearInterval(gameIntervalId);
    startGameButton.disabled = false;
  }
}

function draw() {
  clearCanvas();

  drawSnake();
  drawApple();

  moveSnake();

  checkGameOver();
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
  let key: keyof typeof DIRECTION_KEYS;

  for (key in DIRECTION_KEYS) {
    if (DIRECTION_KEYS[key].includes(event.key) && direction !== OPPOSITE_DIRECTION[key]) {
      direction = key;
      return;
    }
  }
}
