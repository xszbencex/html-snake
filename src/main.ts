import { Coordinate } from './classes/coordinate.class';
import { SnakeBody } from './classes/snake-body.class';
import { DIRECTION_KEYS, DIRECTION_ROTATION, OPPOSITE_DIRECTION } from './constants/direction.constant';
import './style.css';
import { isDirectionKey } from './typeguards/direction-key.typeguard';
import { Direction } from './types/direction.type';
import { randomIntFromInterval } from './utils/random.util';

const RESOLUTION = 40;
const CANVAS_WIDTH = 20;
const CANVAS_HEIGHT = 20;
const SNAKE_START_PLACEMENT_THRESHOLD = 5;
const GAME_SPEED = 10;

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const startGameOverlay = document.getElementById('start-game-overlay') as HTMLDivElement;
const gameOverOverlay = document.getElementById('game-over-overlay') as HTMLDivElement;
const restartGameButton = document.getElementById('restart-game-button') as HTMLButtonElement;
const endGameButton = document.getElementById('end-game-button') as HTMLButtonElement;
const pauseGameButton = document.getElementById('pause-game-button') as HTMLButtonElement;
const continueGameButton = document.getElementById('continue-game-button') as HTMLButtonElement;
const finalScoreText = document.getElementById('final-score') as HTMLSpanElement;
const currentScoreText = document.getElementById('current-score') as HTMLSpanElement;
const ingameTopBar = document.getElementById('ingame-top-bar') as HTMLSpanElement;
const context = canvas.getContext('2d')!;
context.imageSmoothingEnabled = false;

const appleImage = new Image();
appleImage.src = '../assets/apple__padding.png';

const snakeBodyImage = new Image();
snakeBodyImage.src = '../assets/snake-body-long.png';

const snakeBodyCornerImage = new Image();
snakeBodyCornerImage.src = '../assets/snake-body-corner-long.png';

const snakeHeadImage = new Image();
snakeHeadImage.src = '../assets/snake-head-long.png';

const snakeTailImage = new Image();
snakeTailImage.src = '../assets/snake-tail-very-long.png';

let snake: SnakeBody[] = [];
let snakeHead: SnakeBody;
let appleX = 0;
let appleY = 0;
let direction: Direction = 'RIGHT';
let score: number = 0;
let lastDirectionOnDraw: Direction | undefined;

let gameIntervalId: number = NaN;

canvas.width = CANVAS_WIDTH * RESOLUTION;
canvas.height = CANVAS_HEIGHT * RESOLUTION;

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBackgroundGrid() {
  for (let x = 0; x < CANVAS_WIDTH; x++) {
    for (let y = 0; y < CANVAS_HEIGHT; y++) {
      context.fillStyle = (x + y) % 2 ? '#82b62225' : '#ecf87f1b';
      context.fillRect(x * RESOLUTION, y * RESOLUTION, RESOLUTION, RESOLUTION);
    }
  }
}

function drawSnake() {
  snake.forEach((snakePart: SnakeBody, index: number) => {
    if (index === 0) {
      drawTransformedImage(
        snakeHeadImage,
        snakePart.x * RESOLUTION,
        snakePart.y * RESOLUTION,
        RESOLUTION,
        RESOLUTION,
        DIRECTION_ROTATION[snakePart.direction!]
      );
    } else if (index === snake.length - 1) {
      drawTransformedImage(
        snakeTailImage,
        snakePart.x * RESOLUTION,
        snakePart.y * RESOLUTION,
        RESOLUTION,
        RESOLUTION,
        DIRECTION_ROTATION[snakePart.direction!]
      );
    } else {
      const previousPart = snake[index + 1];
      const nextPart = snake[index - 1];

      const isStraightHorizontal = previousPart.y === snakePart.y && nextPart.y === snakePart.y;
      const isStraightVertical = previousPart.x === snakePart.x && nextPart.x === snakePart.x;

      if (isStraightHorizontal || isStraightVertical) {
        drawTransformedImage(
          snakeBodyImage,
          snakePart.x * RESOLUTION,
          snakePart.y * RESOLUTION,
          RESOLUTION,
          RESOLUTION,
          DIRECTION_ROTATION[snakePart.direction!]
        );
      } else {
        drawTransformedImage(
          snakeBodyCornerImage,
          snakePart.x * RESOLUTION,
          snakePart.y * RESOLUTION,
          RESOLUTION,
          RESOLUTION,
          getCornerRotation(snakePart.direction!, previousPart.direction!)
        );
      }
    }
  });
}

function drawTransformedImage(image: HTMLImageElement, x: number, y: number, width: number, height: number, rotation: number) {
  const cx = x + width / 2;
  const cy = y + height / 2;

  context.save();

  context.translate(cx, cy);

  if (rotation) context.rotate(rotation);

  context.drawImage(image, -width / 2, -height / 2, width, height);

  context.restore();
}

function getCornerRotation(currentDirection: Direction, previousPartDirection: Direction): number {
  if (currentDirection === 'DOWN' && previousPartDirection === 'LEFT') return Math.PI / 2;
  if (currentDirection === 'RIGHT' && previousPartDirection === 'UP') return Math.PI / 2;
  if (currentDirection === 'DOWN' && previousPartDirection === 'RIGHT') return Math.PI;
  if (currentDirection === 'LEFT' && previousPartDirection === 'UP') return Math.PI;
  if (currentDirection === 'UP' && previousPartDirection === 'RIGHT') return (3 * Math.PI) / 2;
  if (currentDirection === 'LEFT' && previousPartDirection === 'DOWN') return (3 * Math.PI) / 2;

  return 0;
}

function drawApple() {
  if (appleImage.complete) {
    context.drawImage(appleImage, appleX * RESOLUTION, appleY * RESOLUTION, RESOLUTION, RESOLUTION);
  } else {
    context.beginPath();
    context.arc(appleX * RESOLUTION + RESOLUTION / 2, appleY * RESOLUTION + RESOLUTION / 2, RESOLUTION / 2, 0, Math.PI * 2, false);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
  }
}

function moveSnake() {
  snakeHead.direction = direction;
  for (let i = snake.length - 1; i > 0; i--) {
    const currentPart = snake[i];
    currentPart.coordinates.x = snake[i - 1].coordinates.x;
    currentPart.coordinates.y = snake[i - 1].coordinates.y;
    currentPart.direction = snake[i - 1].direction;
  }
  snakeHead.move(direction);
}

function placeApple() {
  let isSnakePart = true;

  while (isSnakePart) {
    appleX = randomIntFromInterval(0, CANVAS_WIDTH - 1);
    appleY = randomIntFromInterval(0, CANVAS_HEIGHT - 1);
    isSnakePart = snake.some((snakePart: SnakeBody) => snakePart.x === appleX && snakePart.y === appleY);
  }
}

function placeSnake() {
  snake = [];
  snakeHead = new SnakeBody(
    new Coordinate(
      randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, CANVAS_WIDTH - 1 - SNAKE_START_PLACEMENT_THRESHOLD),
      randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, CANVAS_HEIGHT - 1 - SNAKE_START_PLACEMENT_THRESHOLD)
    ),
    direction
  );
  snake.push(snakeHead);
  snake.push(new SnakeBody(new Coordinate(snakeHead.x - 1, snakeHead.y), direction));
  snake.push(new SnakeBody(new Coordinate(snakeHead.x - 2, snakeHead.y), direction));
}

function checkGameOver() {
  const isBorderCollision = snakeHead.x >= CANVAS_WIDTH || snakeHead.x < 0 || snakeHead.y >= CANVAS_HEIGHT || snakeHead.y < 0;
  const isSelfCollision = snake.filter((snakePart: SnakeBody) => snakePart.x === snakeHead.x && snakePart.y === snakeHead.y).length === 2;

  if ((isBorderCollision || isSelfCollision) && !isNaN(gameIntervalId)) {
    endGame();
  }
}

function checkAppleEating(): boolean {
  const isAppleEaten = snakeHead.x === appleX && snakeHead.y === appleY;

  if (isAppleEaten) {
    score++;
    currentScoreText.textContent = score.toString();

    placeApple();

    return true;
  }

  return false;
}

let lastPaintTime = 0;

function draw(ctime: number) {
  gameIntervalId = window.requestAnimationFrame(draw);
  if ((ctime - lastPaintTime) / 1000 < 1 / GAME_SPEED) {
    return;
  }
  lastPaintTime = ctime;
  lastDirectionOnDraw = direction;

  clearCanvas();
  moveSnake();

  const isAppleEaten = checkAppleEating();
  checkGameOver();

  drawBackgroundGrid();
  drawApple();
  drawSnake();

  if (isAppleEaten) {
    snake.push(new SnakeBody(new Coordinate(0, 0), direction));
  }
}

function startGame() {
  document.removeEventListener('keydown', startGameKeydownHandler);
  startGameOverlay.style.display = 'none';
  endGameButton.addEventListener('click', endGame);
  pauseGameButton.addEventListener('click', pauseGame);
  continueGameButton.style.display = 'none';
  ingameTopBar.style.display = 'flex';
  requestAnimationFrame(draw);
}

function endGame() {
  window.cancelAnimationFrame(gameIntervalId);
  gameIntervalId = NaN;
  gameOverOverlay.style.display = 'contents';
  ingameTopBar.style.display = 'none';
  finalScoreText.textContent = score.toString();
  document.removeEventListener('keydown', keyDownHandler);
  restartGameButton.addEventListener('click', () => {
    initializeGame();
  });
  direction = 'RIGHT';
}

function keyDownHandler(event: KeyboardEvent) {
  if (!isDirectionKey(event.key)) {
    return;
  }

  let key: keyof typeof DIRECTION_KEYS;

  for (key in DIRECTION_KEYS) {
    if (DIRECTION_KEYS[key].includes(event.key) && (!lastDirectionOnDraw || key !== OPPOSITE_DIRECTION[lastDirectionOnDraw])) {
      direction = key;
      return;
    }
  }
}

function startGameKeydownHandler(event: KeyboardEvent) {
  if (isNaN(gameIntervalId) && isDirectionKey(event.key)) {
    startGame();
  }
}

function pauseGame() {
  window.cancelAnimationFrame(gameIntervalId);
  pauseGameButton.style.display = 'none';
  continueGameButton.style.display = 'inline';
  continueGameButton.addEventListener('click', continueGame);
  document.removeEventListener('keydown', keyDownHandler);
}

function continueGame() {
  continueGameButton.style.display = 'none';
  pauseGameButton.style.display = 'inline';
  requestAnimationFrame(draw);
  document.addEventListener('keydown', keyDownHandler);
}

function initializeGame() {
  startGameOverlay.style.display = 'contents';
  gameOverOverlay.style.display = 'none';
  ingameTopBar.style.display = 'none';
  score = 0;
  currentScoreText.textContent = score.toString();
  lastDirectionOnDraw = undefined;
  clearCanvas();
  placeSnake();
  placeApple();
  drawBackgroundGrid();
  drawSnake();
  appleImage.onload = () => drawApple();
  appleImage.onerror = () => drawApple();
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keydown', startGameKeydownHandler, false);
}

initializeGame();
