import { GameMode } from '../../types/game-mode.type';
import { BaseOverlay } from './base.overlay';

export class StartGameOverlay extends BaseOverlay {
  private get singlePlayButton() {
    return document.getElementById('single-play-button') as HTMLButtonElement;
  }

  private get pvpPlayButton() {
    return document.getElementById('pvp-play-button') as HTMLButtonElement;
  }

  private get pvePlayButton() {
    return document.getElementById('pve-play-button') as HTMLButtonElement;
  }

  private get settingsButton() {
    return document.getElementById('settings-button') as HTMLButtonElement;
  }

  private get scoreboardButton() {
    return document.getElementById('scoreboard-button') as HTMLButtonElement;
  }

  constructor() {
    super('start-game-overlay');
  }

  protected listenOnEvents() {
    this.singlePlayButton.addEventListener('click', () => this.emit('playButtonClick', GameMode.SINGLE_PLAYER), {
      signal: this.abortSignal,
    });
    this.pvpPlayButton.addEventListener('click', () => this.emit('playButtonClick', GameMode.PVP), { signal: this.abortSignal });
    this.pvePlayButton.addEventListener('click', () => this.emit('playButtonClick', GameMode.PVE), { signal: this.abortSignal });
    this.settingsButton.addEventListener('click', () => this.emit('settingsButtonClick'), { signal: this.abortSignal });
    this.scoreboardButton.addEventListener('click', () => this.emit('scoreboardButton'), { signal: this.abortSignal });
  }
}
