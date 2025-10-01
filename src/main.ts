import { AudioHandler } from './classes/audio-handler.class';
import { CanvasHandler } from './classes/canvas-handler.class';
import { Coordinate } from './classes/coordinate.class';
import { GameSettings } from './classes/game-settings.class';
import { ObjectHandler } from './classes/object-handler.class';
import { ScoreHandler } from './classes/score-handler.class';
import { SnakeBody } from './classes/snake-body.class';
import { DIRECTION_KEYS, OPPOSITE_DIRECTION } from './constants/direction.constant';
import { DEFAULT_SNAKE_LENGTH, RESOLUTION } from './constants/settings.constants';
import { isDirectionKey } from './typeguards/direction-key.typeguard';
import { Direction } from './types/direction.type';

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
const finalAppleCountText = document.getElementById('final-apple-count') as HTMLSpanElement;

let direction: Direction = 'RIGHT';
let lastDirectionOnDraw: Direction = 'RIGHT';

let gameIntervalId: number = NaN;
let lastDrawTime = 0;

function redrawCanvas(deltaTime?: number) {
  canvasHandler.clearCanvas();
  canvasHandler.drawBackgroundGrid(gameSettings.mapSize);
  canvasHandler.drawApple(objectHandler.apple, deltaTime);
  canvasHandler.drawSnake(objectHandler.snake);
}

function draw(timestamp: number) {
  gameIntervalId = window.requestAnimationFrame(draw);
  const deltaTime = timestamp - lastDrawTime;
  redrawCanvas(deltaTime);

  if (deltaTime / 1000 < 1 / gameSettings.speed) {
    return;
  }

  lastDrawTime = timestamp;
  lastDirectionOnDraw = direction;

  const shouldIncreaseSnakeAfterAppleEaten = scoreHandler.appleCount + DEFAULT_SNAKE_LENGTH > objectHandler.snake.length;
  if (shouldIncreaseSnakeAfterAppleEaten) {
    objectHandler.snake.push(new SnakeBody(new Coordinate(0, 0), direction));
  }

  objectHandler.moveSnake(direction);

  const isAppleEaten = objectHandler.checkAppleEating();

  if (isAppleEaten) {
    scoreHandler.increaseScore(gameSettings.speed, objectHandler.apple.baseScale);
    objectHandler.placeApple(scoreHandler.isNextAppleSpecial());
  }

  const isGameOver = objectHandler.checkSnakeCollision();

  if (isGameOver) {
    redrawCanvas();
    endGame();
  }
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
  gameSettings.listenOnInputChanges(onMapResize, () => audioHandler.setAudioVolume(gameSettings.volume));
  backButton.addEventListener('click', () => switchOverlay([startGameOverlay]), { once: true });
}

function onMapResize() {
  canvasHandler.resizeCanvas(gameSettings.mapSize);
  objectHandler.initialize(direction);
  redrawCanvas();
}

function endGame() {
  audioHandler.onGameEnd();
  window.cancelAnimationFrame(gameIntervalId);
  gameIntervalId = NaN;
  switchOverlay([gameOverOverlay]);
  finalScoreText.textContent = scoreHandler.score.toString();
  finalAppleCountText.textContent = scoreHandler.appleCount.toString();
  document.removeEventListener('keydown', keyDownHandler);
  restartGameButton.addEventListener('click', () => initializeGame(), { once: true });
}

function pauseGame() {
  audioHandler.backgroundMusic.pause();
  window.cancelAnimationFrame(gameIntervalId);
  pauseGameButton.style.display = 'none';
  continueGameButton.style.display = 'inline';
  switchOverlay([gamePausedOverlay, ingameTopBar]);
  continueGameButton.addEventListener('click', continueGame);
  document.removeEventListener('keydown', keyDownHandler);
}

function continueGame() {
  audioHandler.backgroundMusic.play();
  continueGameButton.style.display = 'none';
  pauseGameButton.style.display = 'inline';
  switchOverlay([ingameTopBar]);
  requestAnimationFrame(draw);
  document.addEventListener('keydown', keyDownHandler);
}

function startGame() {
  endGameButton.addEventListener('click', endGame);
  pauseGameButton.addEventListener('click', pauseGame);
  continueGameButton.style.display = 'none';
  pauseGameButton.style.display = 'inline';
  switchOverlay([ingameTopBar]);
  requestAnimationFrame(draw);
  audioHandler.backgroundMusic.play();
}

function initializeGame() {
  canvas.width = gameSettings.mapSize * RESOLUTION;
  canvas.height = gameSettings.mapSize * RESOLUTION;
  switchOverlay([startGameOverlay]);
  scoreHandler.initialize();
  direction = 'RIGHT';
  lastDirectionOnDraw = 'RIGHT';
  objectHandler.initialize(direction);
  redrawCanvas();
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keydown', startGameKeydownHandler, { once: true });
  settingsButton.addEventListener('click', onSettingsButtonClicked);
  audioHandler.onGameInit();
}

function resizeGame() {
  const smallerSide = Math.min(pageWrapper.clientWidth, pageWrapper.clientHeight);
  gameWrapper.style.maxWidth = `${smallerSide}px`;
  gameWrapper.style.maxHeight = `${smallerSide}px`;
}

const gameSettings = new GameSettings();
const audioHandler = new AudioHandler();
const canvasHandler = new CanvasHandler(canvas);
const objectHandler = new ObjectHandler(direction, gameSettings);
const scoreHandler = new ScoreHandler();

Promise.all([canvasHandler.preloadImages(), audioHandler.preloadAudio()])
  .then(() => {
    audioHandler.setAudioVolume(gameSettings.volume);

    resizeGame();
    window.addEventListener('resize', resizeGame);

    initializeGame();
  })
  .catch((err) => console.error('Error while loading assets:', err));
