import { Coordinate } from './classes/coordinate.class';
import { DIRECTION_KEYS, OPPOSITE_DIRECTION } from './constants/direction.constant';
import './style.css';
import { Direction } from './types/direction.type';
import { randomIntFromInterval } from './utils/random.util';

const RESOLUTION = 20;
const CANVAS_WIDTH = 20;
const CANVAS_HEIGHT = 20;
const SNAKE_START_PLACEMENT_THRESHOLD = 5;

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!;
const startGameButton = document.getElementById('start-game-button') as HTMLButtonElement;

let snake: Coordinate[] = [];
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
  for (let snakePart of snake) {
    context.beginPath();
    context.rect(snakePart.x * RESOLUTION, snakePart.y * RESOLUTION, RESOLUTION, RESOLUTION);
    context.fillStyle = 'green';
    context.fill();
    context.closePath();
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
  let previousPartCoordinate: Coordinate;
  snake.forEach((snakePart: Coordinate, index: number) => {
    if (index === 0) {
      previousPartCoordinate = new Coordinate(snakePart.x, snakePart.y);
      snakePart.move(direction);
    } else {
      const prevPart = new Coordinate(snakePart.x, snakePart.y);
      snakePart.moveTo(previousPartCoordinate.x, previousPartCoordinate.y);
      previousPartCoordinate = prevPart;
    }
  });
}

function placeApple() {
  let isSnakePart = true;

  while (isSnakePart) {
    appleX = randomIntFromInterval(0, CANVAS_WIDTH - 1);
    appleY = randomIntFromInterval(0, CANVAS_HEIGHT - 1);
    isSnakePart = snake.some((snakePart: Coordinate) => snakePart.x === appleX && snakePart.y === appleY);
  }
}

function placeSnake() {
  snake = [];
  snake.push(
    new Coordinate(
      randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, CANVAS_WIDTH - 1 - SNAKE_START_PLACEMENT_THRESHOLD),
      randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, CANVAS_HEIGHT - 1 - SNAKE_START_PLACEMENT_THRESHOLD)
    )
  );
}

function checkGameOver() {
  const isBorderCollision = snake[0].x >= CANVAS_WIDTH || snake[0].x < 0 || snake[0].y >= CANVAS_HEIGHT || snake[0].y < 0;
  const isSelfCollision = snake.find(
    (snakePart: Coordinate, index: number) => index !== 0 && snakePart.x === snake[0].x && snakePart.y === snake[0].y
  );

  if ((isBorderCollision || isSelfCollision) && gameIntervalId) {
    clearInterval(gameIntervalId);
    startGameButton.disabled = false;
  }
}

function checkAppleEating() {
  const isAppleEaten = snake[0].x === appleX && snake[0].y === appleY;

  if (isAppleEaten) {
    const lastSnakePart = snake[snake.length - 1];
    const penultimateSnakePart = snake[snake.length - 2];
    const newPart = new Coordinate(lastSnakePart.x, lastSnakePart.y);

    if (!penultimateSnakePart) {
      newPart.move(OPPOSITE_DIRECTION[direction]);
      snake.push(newPart);
    } else {
      newPart.move(OPPOSITE_DIRECTION[getDirectionOfSiblingParts(lastSnakePart, penultimateSnakePart)]);
      snake.push(newPart);
    }

    placeApple();
  }
}

function getDirectionOfSiblingParts(firstPart: Coordinate, secondPart: Coordinate): Direction {
  if (firstPart.x > secondPart.x) {
    return 'RIGHT';
  } else if (firstPart.x < secondPart.x) {
    return 'LEFT';
  } else if (firstPart.y > secondPart.y) {
    return 'DOWN';
  } else {
    return 'UP';
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
