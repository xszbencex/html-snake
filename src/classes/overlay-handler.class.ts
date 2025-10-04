import { GameMode } from '../types/game-mode.type';
import { EventEmitter } from './event-emitter.class';
import { BaseOverlay } from './overlays/base.overlay';
import { BeforePlayOverlay } from './overlays/before-play.overlay';
import { GameOverOverlay } from './overlays/game-over.overlay';
import { GamePausedOverlay } from './overlays/game-paused.overlay';
import { SettingsOverlay } from './overlays/settings.overlay';
import { StartGameOverlay } from './overlays/start-game.overlay';
import { TopBarOverlay } from './overlays/top-bar.overlay';
import { Snake } from './snake.class';

export class OverlayHandler extends EventEmitter {
  readonly startGameOverlay = new StartGameOverlay();
  readonly topBarOverlay = new TopBarOverlay();
  readonly settingsOverlay = new SettingsOverlay();
  readonly beforePlayOverlay = new BeforePlayOverlay();
  readonly gamePausedOverlay = new GamePausedOverlay();
  readonly gameOverOverlay = new GameOverOverlay();

  constructor() {
    super();
    this.switchOverlay([this.startGameOverlay]);
    this.startGameOverlay.on('playButtonClick', () => {
      this.emit('playButtonClick');
      this.switchOverlay([this.beforePlayOverlay, this.topBarOverlay]);
    });

    this.startGameOverlay.on('settingsButtonClick', () => this.switchOverlay([this.settingsOverlay]));

    this.settingsOverlay.on('settingsBackButtonClick', () => this.switchOverlay([this.startGameOverlay]));

    this.topBarOverlay.on('endGameButtonClick', () => {
      this.switchOverlay([this.gameOverOverlay]);
      this.emit('endGameButtonClick');
    });

    this.topBarOverlay.on('pauseGameButtonClick', () => {
      this.switchOverlay([this.gamePausedOverlay, this.topBarOverlay]);
      this.emit('pauseGameButtonClick');
    });

    this.topBarOverlay.on('continueGameButtonClick', () => {
      this.switchOverlay([this.topBarOverlay]);
      this.emit('continueGameButtonClick');
    });

    this.gameOverOverlay.on('restartButtonClick', () => {
      this.switchOverlay([this.startGameOverlay]);
      this.emit('restartButtonClick');
    });
  }

  onPlay(gameMode: GameMode) {
    this.switchOverlay([this.topBarOverlay]);
    this.topBarOverlay.onPlay(gameMode);
  }

  onGameOver(finalScore: number, finalAppleCount: number, winners: Snake[] | undefined) {
    this.switchOverlay([this.gameOverOverlay]);
    this.gameOverOverlay.onGameEnd(finalScore, finalAppleCount, winners);
  }

  private switchOverlay(visibleOverlays: readonly BaseOverlay[]) {
    [
      this.startGameOverlay,
      this.settingsOverlay,
      this.gameOverOverlay,
      this.topBarOverlay,
      this.gamePausedOverlay,
      this.beforePlayOverlay,
    ].forEach((overlay) => {
      visibleOverlays.includes(overlay) ? overlay.activate() : overlay.deactivate();
    });
  }
}
