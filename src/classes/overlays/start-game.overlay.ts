import { BaseOverlay } from './base.overlay';

export class StartGameOverlay extends BaseOverlay {
  private get playButton() {
    return document.getElementById('play-button') as HTMLButtonElement;
  }
  private get settingsButton() {
    return document.getElementById('settings-button') as HTMLButtonElement;
  }

  constructor() {
    super('start-game-overlay');
  }

  protected listenOnEvents() {
    this.playButton.addEventListener('click', () => this.emit('playButtonClick'), { signal: this.abortSignal });
    this.settingsButton.addEventListener('click', () => this.emit('settingsButtonClick'), { signal: this.abortSignal });
  }
}
