import { Coordinate } from './classes/coordinate.class';
import { GameSettings } from './classes/game-settings.class';
import { SnakeBody } from './classes/snake-body.class';
import { DIRECTION_KEYS, DIRECTION_ROTATION, OPPOSITE_DIRECTION } from './constants/direction.constant';
import { RESOLUTION, SNAKE_START_PLACEMENT_THRESHOLD } from './constants/settings.constants';
import { isDirectionKey } from './typeguards/direction-key.typeguard';
import { Direction } from './types/direction.type';
import { loadAudio, loadImage } from './utils/load-assets.utils';
import { randomIntFromInterval } from './utils/random.util';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const gameWrapper = document.getElementById('game-wrapper') as HTMLDivElement;
const pageWrapper = document.getElementById('page-wrapper') as HTMLDivElement;
const startGameOverlay = document.getElementById('start-game-overlay') as HTMLDivElement;
const settingsOverlay = document.getElementById('settings-overlay') as HTMLDivElement;
const gameOverOverlay = document.getElementById('game-over-overlay') as HTMLDivElement;
const ingameTopBar = document.getElementById('ingame-top-bar') as HTMLDivElement;
const gamePausedOverlay = document.getElementById('game-paused-overlay') as HTMLDivElement;
const restartGameButton = document.getElementById('restart-game-button') as HTMLButtonElement;
const endGameButton = document.getElementById('end-game-button') as HTMLButtonElement;
const pauseGameButton = document.getElementById('pause-game-button') as HTMLButtonElement;
const continueGameButton = document.getElementById('continue-game-button') as HTMLButtonElement;
const settingsButton = document.getElementById('settings-button') as HTMLButtonElement;
const backButton = document.getElementById('back-button') as HTMLButtonElement;
const finalScoreText = document.getElementById('final-score') as HTMLSpanElement;
const currentScoreText = document.getElementById('current-score') as HTMLSpanElement;
const context = canvas.getContext('2d')!;
context.imageSmoothingEnabled = false;

const gameSettings = new GameSettings();

let backgroundMusic: HTMLAudioElement;
let gameOverSound: HTMLAudioElement;

let appleImage: HTMLImageElement;
let snakeBodyImage: HTMLImageElement;
let snakeBodyCornerImage: HTMLImageElement;
let snakeHeadImage: HTMLImageElement;
let snakeTailImage: HTMLImageElement;

let snake: SnakeBody[] = [];
let snakeHead: SnakeBody;
let apple: Coordinate;
let direction: Direction = 'RIGHT';
let score: number = 0;
let lastDirectionOnDraw: Direction = 'RIGHT';

let gameIntervalId: number = NaN;

function resizeCanvas() {
  const smallerSide = Math.min(pageWrapper.clientWidth, pageWrapper.clientHeight);
  gameWrapper.style.maxWidth = `${smallerSide}px`;
  gameWrapper.style.maxHeight = `${smallerSide}px`;
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBackgroundGrid() {
  for (let x = 0; x < gameSettings.mapSize; x++) {
    for (let y = 0; y < gameSettings.mapSize; y++) {
      context.fillStyle = (x + y) % 2 ? '#82b62225' : '#ecf87f1b';
      context.fillRect(x * RESOLUTION, y * RESOLUTION, RESOLUTION, RESOLUTION);
    }
  }
}

function drawSnake() {
  snake.forEach((snakePart: SnakeBody, index: number) => {
    if (index === 0) {
      drawTransformedImage(snakeHeadImage, snakePart, DIRECTION_ROTATION[snakePart.direction!]);
    } else if (index === snake.length - 1) {
      drawTransformedImage(snakeTailImage, snakePart, DIRECTION_ROTATION[snakePart.direction!]);
    } else {
      const previousPart = snake[index + 1];
      const nextPart = snake[index - 1];

      const isStraightHorizontal = previousPart.y === snakePart.y && nextPart.y === snakePart.y;
      const isStraightVertical = previousPart.x === snakePart.x && nextPart.x === snakePart.x;

      if (isStraightHorizontal || isStraightVertical) {
        drawTransformedImage(snakeBodyImage, snakePart, DIRECTION_ROTATION[snakePart.direction!]);
      } else {
        drawTransformedImage(snakeBodyCornerImage, snakePart, getCornerRotation(snakePart.direction!, previousPart.direction!));
      }
    }
  });
}

function drawTransformedImage(image: HTMLImageElement, snakePart: SnakeBody, rotation: number) {
  const x = snakePart.x * RESOLUTION;
  const y = snakePart.y * RESOLUTION;
  const width = RESOLUTION;
  const height = RESOLUTION;

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
  context.drawImage(appleImage, apple.x * RESOLUTION, apple.y * RESOLUTION, RESOLUTION, RESOLUTION);
}

function moveSnake() {
  snakeHead.direction = direction;
  for (let i = snake.length - 1; i > 0; i--) {
    const currentPart = snake[i];
    currentPart.coordinates.x = snake[i - 1].coordinates.x;
    currentPart.coordinates.y = snake[i - 1].coordinates.y;
    currentPart.direction = snake[i - 1].direction;
  }
  if (gameSettings.canGoThroughWalls) {
    snakeHead.moveWithWallWalkthrough(direction, gameSettings.mapSize, gameSettings.mapSize);
  } else {
    snakeHead.move(direction);
  }
}

function placeApple() {
  let isSnakePart = true;

  while (isSnakePart) {
    apple = new Coordinate(randomIntFromInterval(0, gameSettings.mapSize - 1), randomIntFromInterval(0, gameSettings.mapSize - 1));

    isSnakePart = snake.some((snakePart: SnakeBody) => snakePart.x === apple.x && snakePart.y === apple.y);
  }
}

function placeSnake() {
  snake = [];
  snakeHead = new SnakeBody(
    new Coordinate(
      randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, gameSettings.mapSize - 1 - SNAKE_START_PLACEMENT_THRESHOLD),
      randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, gameSettings.mapSize - 1 - SNAKE_START_PLACEMENT_THRESHOLD)
    ),
    direction
  );
  snake.push(snakeHead);
  snake.push(new SnakeBody(new Coordinate(snakeHead.x - 1, snakeHead.y), direction));
  snake.push(new SnakeBody(new Coordinate(snakeHead.x - 2, snakeHead.y), direction));
}

function checkGameOver() {
  const isBorderCollision =
    snakeHead.x >= gameSettings.mapSize || snakeHead.x < 0 || snakeHead.y >= gameSettings.mapSize || snakeHead.y < 0;
  const isSelfCollision = snake.filter((snakePart: SnakeBody) => snakePart.x === snakeHead.x && snakePart.y === snakeHead.y).length === 2;

  if (((!gameSettings.canGoThroughWalls && isBorderCollision) || isSelfCollision) && !isNaN(gameIntervalId)) {
    endGame();
    return true;
  }

  return false;
}

function checkAppleEating(): boolean {
  const isAppleEaten = snakeHead.x === apple.x && snakeHead.y === apple.y;

  if (isAppleEaten) {
    score = score + 1 * gameSettings.speed;
    currentScoreText.textContent = score.toString();

    placeApple();

    return true;
  }

  return false;
}

let lastPaintTime = 0;

function draw(ctime: number) {
  gameIntervalId = window.requestAnimationFrame(draw);
  if ((ctime - lastPaintTime) / 1000 < 1 / gameSettings.speed) {
    return;
  }
  lastPaintTime = ctime;
  lastDirectionOnDraw = direction;

  moveSnake();

  const isAppleEaten = checkAppleEating();
  const isGameOver = checkGameOver();

  if (isGameOver) return;

  clearCanvas();
  drawBackgroundGrid();
  drawApple();
  drawSnake();

  if (isAppleEaten) {
    snake.push(new SnakeBody(new Coordinate(0, 0), direction));
  }
}

function startGame() {
  endGameButton.addEventListener('click', endGame);
  pauseGameButton.addEventListener('click', pauseGame);
  continueGameButton.style.display = 'none';
  switchOverlay([ingameTopBar]);
  requestAnimationFrame(draw);
  backgroundMusic.play();
}

function endGame() {
  backgroundMusic.pause();
  gameOverSound.play();
  window.cancelAnimationFrame(gameIntervalId);
  gameIntervalId = NaN;
  switchOverlay([gameOverOverlay]);
  finalScoreText.textContent = score.toString();
  document.removeEventListener('keydown', keyDownHandler);
  restartGameButton.addEventListener('click', () => initializeGame(), { once: true });
}

function keyDownHandler(event: KeyboardEvent) {
  if (!isDirectionKey(event.key)) {
    return;
  }

  let key: keyof typeof DIRECTION_KEYS;

  for (key in DIRECTION_KEYS) {
    if (DIRECTION_KEYS[key].includes(event.key) && key !== OPPOSITE_DIRECTION[lastDirectionOnDraw]) {
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

function switchOverlay(visibleOverlays: readonly HTMLDivElement[]) {
  [startGameOverlay, settingsOverlay, gameOverOverlay, ingameTopBar, gamePausedOverlay].forEach((overlay) => {
    visibleOverlays.includes(overlay) ? overlay.classList.add('active') : overlay.classList.remove('active');
  });
}

function onSettingsButtonClicked() {
  switchOverlay([settingsOverlay]);
  gameSettings.listenOnInputChanges(onCanvasResize, onvolumechange);
  backButton.addEventListener('click', () => switchOverlay([startGameOverlay]), { once: true });
}

function onCanvasResize() {
  canvas.width = gameSettings.mapSize * RESOLUTION;
  canvas.height = gameSettings.mapSize * RESOLUTION;
  clearCanvas();
  placeApple();
  placeSnake();
  drawBackgroundGrid();
  drawApple();
  drawSnake();
}

function onvolumechange() {
  backgroundMusic.volume = gameSettings.volume;
  gameOverSound.volume = gameSettings.volume;
}

function pauseGame() {
  backgroundMusic.pause();
  window.cancelAnimationFrame(gameIntervalId);
  pauseGameButton.style.display = 'none';
  continueGameButton.style.display = 'inline';
  switchOverlay([gamePausedOverlay, ingameTopBar]);
  continueGameButton.addEventListener('click', continueGame);
  document.removeEventListener('keydown', keyDownHandler);
}

function continueGame() {
  backgroundMusic.play();
  continueGameButton.style.display = 'none';
  pauseGameButton.style.display = 'inline';
  switchOverlay([ingameTopBar]);
  requestAnimationFrame(draw);
  document.addEventListener('keydown', keyDownHandler);
}

function initializeGame() {
  canvas.width = gameSettings.mapSize * RESOLUTION;
  canvas.height = gameSettings.mapSize * RESOLUTION;
  switchOverlay([startGameOverlay]);
  score = 0;
  currentScoreText.textContent = score.toString();
  direction = 'RIGHT';
  lastDirectionOnDraw = 'RIGHT';
  clearCanvas();
  placeSnake();
  placeApple();
  drawBackgroundGrid();
  drawSnake();
  drawApple();
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keydown', startGameKeydownHandler, { once: true });
  settingsButton.addEventListener('click', onSettingsButtonClicked);
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
  gameOverSound.currentTime = 0;
  gameOverSound.pause();
}

async function preloadAssets(): Promise<void> {
  backgroundMusic = await loadAudio('/background-music.mp3');
  gameOverSound = await loadAudio('/game-over-sound.mp3');
  appleImage = await loadImage('/apple__padding.png');
  snakeBodyImage = await loadImage('/snake-body-long.png');
  snakeBodyCornerImage = await loadImage('/snake-body-corner-long.png');
  snakeHeadImage = await loadImage('/snake-head-long.png');
  snakeTailImage = await loadImage('/snake-tail-very-long.png');

  backgroundMusic.loop = true;
  backgroundMusic.volume = gameSettings.volume;
  gameOverSound.volume = gameSettings.volume;
}

preloadAssets()
  .then(() => {
    resizeCanvas();
    initializeGame();
    window.addEventListener('resize', resizeCanvas);
  })
  .catch((err) => console.error('Error while loading assets:', err));
