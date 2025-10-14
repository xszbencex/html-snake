import { DIRECTION_KEYS, OPPOSITE_DIRECTION } from '../constants/direction.constant';
import { AppleEatenInfo } from '../interfaces/apple-eaten-info.interface';
import { isDirectionKey } from '../typeguards/direction-key.typeguard';
import { GameMode } from '../types/game-mode.type';
import { AudioHandler } from './audio-handler.class';
import { CanvasHandler } from './canvas-handler.class';
import { GameSettings } from './game-settings.class';
import { ObjectHandler } from './object-handler.class';
import { OverlayHandler } from './overlay-handler.class';
import { ScoreHandler } from './score-handler.class';
import { Snake } from './snake.class';

export class Game {
  private readonly canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  private readonly gameWrapper = document.getElementById('game-wrapper') as HTMLDivElement;
  private readonly pageWrapper = document.getElementById('page-wrapper') as HTMLDivElement;

  gameIntervalId: number = NaN;
  lastDrawTime = 0;

  overlayHandler!: OverlayHandler;
  audioHandler!: AudioHandler;
  canvasHandler!: CanvasHandler;
  gameSettings!: GameSettings;
  objectHandler!: ObjectHandler;
  scoreHandler!: ScoreHandler;

  startGameAbortController = new AbortController();
  pauseGameAbortController = new AbortController();

  constructor() {
    this.audioHandler = new AudioHandler();
    this.canvasHandler = new CanvasHandler(this.canvas);

    Promise.all([this.canvasHandler.preloadImages(), this.audioHandler.preloadAudio()])
      .then(() => {
        this.resizeGame();
        window.addEventListener('resize', () => this.resizeGame());

        this.overlayHandler = new OverlayHandler();
        this.gameSettings = new GameSettings(this.overlayHandler.settingsOverlay, this.audioHandler);
        this.objectHandler = new ObjectHandler(this.gameSettings);
        this.scoreHandler = new ScoreHandler(this.overlayHandler.topBarOverlay, this.overlayHandler.scoreboardOverlay);

        this.overlayHandler.on('playButtonClick', (gameMode: GameMode) => this.onPlayButtonClick(gameMode));
        this.overlayHandler.on('scoreboardButtonClick', () => this.onScoreboardButtonClick());
        this.overlayHandler.on('endGameButtonClick', () => this.endGame(this.gameSettings.gameMode === 'PVP' ? [] : undefined));
        this.overlayHandler.on('pauseGameButtonClick', () => this.pauseGame());
        this.overlayHandler.on('continueGameButtonClick', () => this.continueGame());
        this.overlayHandler.on('restartButtonClick', () => {
          this.initializeGame();
          this.onPlayButtonClick(this.gameSettings.gameMode);
        });
        this.overlayHandler.on('mainMenuButtonClick', () => this.initializeGame());

        document.addEventListener('keydown', this.keyDownHandler.bind(this));

        this.initializeGame();
      })
      .catch((err) => console.error('Error while loading assets:', err));
  }

  initializeGame() {
    this.canvasHandler.resizeCanvas(this.gameSettings.mapSize);
    this.objectHandler.clear();
    this.scoreHandler.initialize();
    this.redrawCanvas();
    this.audioHandler.onGameInit();
  }

  onScoreboardButtonClick() {
    this.overlayHandler.scoreboardOverlay.scoreGameModeSelect.value = this.gameSettings.gameMode;
    this.scoreHandler.showHighScores(this.gameSettings.gameMode);
  }

  onPlayButtonClick(gameMode: GameMode) {
    this.gameSettings.gameMode = gameMode;
    this.canvasHandler.resizeCanvas(this.gameSettings.mapSize);
    this.objectHandler.initialize();
    this.overlayHandler.beforePlayOverlay.showHint(this.gameSettings.gameMode, this.objectHandler.snakes);
    this.redrawCanvas();
    this.startGameAbortController = new AbortController();
    document.addEventListener('keydown', this.startGameKeydownHandler.bind(this), { signal: this.startGameAbortController.signal });
  }

  startGame() {
    this.pauseGameAbortController = new AbortController();
    document.addEventListener('keydown', this.pauseGameKeydownHandler.bind(this), { signal: this.pauseGameAbortController.signal });
    requestAnimationFrame((timestamp) => this.draw(timestamp));
    this.audioHandler.backgroundMusic.play();
    this.overlayHandler.onPlay(this.gameSettings.gameMode);
  }

  pauseGame() {
    this.audioHandler.backgroundMusic.pause();
    window.cancelAnimationFrame(this.gameIntervalId);
  }

  continueGame() {
    this.audioHandler.backgroundMusic.play();
    requestAnimationFrame((timestamp) => this.draw(timestamp));
  }

  resizeGame() {
    const smallerSide = Math.min(this.pageWrapper.clientWidth, this.pageWrapper.clientHeight);
    this.gameWrapper.style.maxWidth = `${smallerSide}px`;
    this.gameWrapper.style.maxHeight = `${smallerSide}px`;
  }

  endGame(winners?: Snake[]) {
    this.pauseGameAbortController.abort();
    this.audioHandler.onGameEnd();
    this.startGameAbortController.abort();
    window.cancelAnimationFrame(this.gameIntervalId);
    this.gameIntervalId = NaN;
    this.overlayHandler.onGameOver(this.scoreHandler.score, this.scoreHandler.appleCount, winners);
    this.scoreHandler.storeScore(this.gameSettings.gameMode, winners);
  }

  redrawCanvas(deltaTime?: number) {
    this.canvasHandler.clearCanvas();
    this.canvasHandler.drawBackgroundGrid(this.gameSettings.mapSize);
    this.objectHandler.apples.forEach((apple) => this.canvasHandler.drawApple(apple, deltaTime));
    this.objectHandler.snakes.forEach((snake) => this.canvasHandler.drawSnake(snake));
  }

  draw(timestamp: number) {
    this.gameIntervalId = window.requestAnimationFrame((timestamp) => this.draw(timestamp));
    const deltaTime = timestamp - this.lastDrawTime;
    this.redrawCanvas(deltaTime);

    if (deltaTime / 1000 < 1 / this.gameSettings.speed) {
      return;
    }

    this.lastDrawTime = timestamp;

    this.objectHandler.moveSnakes();

    const appleEatenInfo = this.objectHandler.checkAppleEating();

    appleEatenInfo.forEach(({ eatenApple, eatenBySnake }: AppleEatenInfo) => {
      this.scoreHandler.increaseScore(this.gameSettings.speed, eatenApple.baseScale);
      eatenBySnake.increaseSnakeLength(this.gameSettings);
      this.objectHandler.replaceApple(eatenApple, this.scoreHandler.isNextAppleSpecial());
    });

    const collidedSnakes = this.objectHandler.checkSnakeCollision();
    const isGameOver = collidedSnakes.length > 0;

    if (isGameOver) {
      const winnerIndexes =
        this.gameSettings.gameMode === 'PVP' ? this.objectHandler.snakes.filter((snake) => !collidedSnakes.includes(snake)) : undefined;

      this.redrawCanvas();
      this.endGame(winnerIndexes);
    }
  }

  pauseGameKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();

      if (this.overlayHandler.gamePausedOverlay.isActivated) {
        this.overlayHandler.topBarOverlay.continueGameButton.click();
      } else {
        this.overlayHandler.topBarOverlay.pauseGameButton.click();
      }
    }
  }

  keyDownHandler(event: KeyboardEvent) {
    const directionInfo = this.getDirectionByKey(event.key);
    event.preventDefault();

    if (directionInfo) {
      directionInfo.snake.direction = directionInfo.direction;
    }
  }

  startGameKeydownHandler(event: KeyboardEvent) {
    const directionInfo = this.getDirectionByKey(event.key);
    event.preventDefault();

    if (directionInfo) {
      this.overlayHandler.beforePlayOverlay.tickPlayerHint(directionInfo.snake.index);
      directionInfo.snake.isReady = true;

      if (this.objectHandler.isEverySnakeReady()) {
        this.startGameAbortController.abort();
        this.startGame();
      }
    }
  }

  getDirectionByKey(eventKey: string) {
    if (isDirectionKey(eventKey) && this.objectHandler.snakes.length > 0) {
      let direction: keyof typeof DIRECTION_KEYS;

      for (direction in DIRECTION_KEYS) {
        const indexOfKey = DIRECTION_KEYS[direction].findIndex((key) => key === eventKey);

        if (indexOfKey === -1) {
          continue;
        }

        const snake = this.objectHandler.snakes[indexOfKey] ?? this.objectHandler.snakes[0];

        if (direction !== OPPOSITE_DIRECTION[snake.head.direction]) {
          return { direction, snake };
        }
      }
    }

    return undefined;
  }
}
