import { Coordinate } from './classes/coordinate.class';
import { DIRECTION_KEYS, OPPOSITE_DIRECTION } from './constants/direction.constant';
import './style.css';
import { Direction } from './types/direction.type';
import { randomIntFromInterval } from './utils/random.util';

const RESOLUTION = 20;
const CANVAS_WIDTH = 20;
const CANVAS_HEIGHT = 20;
const SNAKE_START_PLACEMENT_THRESHOLD = 5;
const GAME_SPEED = 100;

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;
const startGameButton = document.getElementById('start-game-button') as HTMLButtonElement;

let snakeBody: Coordinate[] = [];
let snakeHead: Coordinate;
let snakeLength: number = 1;
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
  for (let snakePart of snakeBody) {
    context.fillStyle = 'green';
    context.fillRect(snakePart.x * RESOLUTION, snakePart.y * RESOLUTION, RESOLUTION - 2, RESOLUTION - 2);
  }
}

function drawApple() {
  context.beginPath();
  context.arc(appleX * RESOLUTION + RESOLUTION / 2, appleY * RESOLUTION + RESOLUTION / 2, RESOLUTION / 2, 0, Math.PI * 2, false);
  context.fillStyle = 'red';
  context.fill();
  context.closePath();
}

function moveSnake() {
  snakeHead.move(direction);
  snakeBody.push(new Coordinate(snakeHead.x, snakeHead.y));

  while (snakeBody.length > snakeLength) {
    snakeBody.shift();
  }
}

function placeApple() {
  let isSnakePart = true;

  while (isSnakePart) {
    appleX = randomIntFromInterval(0, CANVAS_WIDTH - 1);
    appleY = randomIntFromInterval(0, CANVAS_HEIGHT - 1);
    isSnakePart = snakeBody.some((snakePart: Coordinate) => snakePart.x === appleX && snakePart.y === appleY);
  }
}

function placeSnake() {
  snakeBody = [];
  snakeLength = 1;
  snakeHead = new Coordinate(
    randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, CANVAS_WIDTH - 1 - SNAKE_START_PLACEMENT_THRESHOLD),
    randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, CANVAS_HEIGHT - 1 - SNAKE_START_PLACEMENT_THRESHOLD)
  );
  snakeBody.push(snakeHead);
}

function checkGameOver() {
  const isBorderCollision = snakeHead.x >= CANVAS_WIDTH || snakeHead.x < 0 || snakeHead.y >= CANVAS_HEIGHT || snakeHead.y < 0;
  const isSelfCollision =
    snakeBody.filter((snakePart: Coordinate) => snakePart.x === snakeHead.x && snakePart.y === snakeHead.y).length === 2;

  if ((isBorderCollision || isSelfCollision) && gameIntervalId) {
    clearInterval(gameIntervalId);
    startGameButton.disabled = false;
  }
}

function checkAppleEating() {
  const isAppleEaten = snakeHead.x === appleX && snakeHead.y === appleY;

  if (isAppleEaten) {
    snakeLength++;

    placeApple();
  }
}

function draw() {
  clearCanvas();

  drawSnake();
  drawApple();

  moveSnake();

  checkGameOver();

  checkAppleEating();
}

function startGame() {
  placeSnake();
  placeApple();
  draw();
  gameIntervalId = setInterval(() => draw(), GAME_SPEED);
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
