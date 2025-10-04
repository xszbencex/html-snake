import { GameMode } from '../../types/game-mode.type';
import { BaseOverlay } from './base.overlay';

export class TopBarOverlay extends BaseOverlay {
  private get endGameButton() {
    return document.getElementById('end-game-button') as HTMLButtonElement;
  }

  private get pauseGameButton() {
    return document.getElementById('pause-game-button') as HTMLButtonElement;
  }

  private get continueGameButton() {
    return document.getElementById('continue-game-button') as HTMLButtonElement;
  }

  get currentScoreText() {
    return document.getElementById('current-score') as HTMLSpanElement;
  }

  get appleCountText() {
    return document.getElementById('apple-count') as HTMLSpanElement;
  }

  get pveInfos() {
    return document.getElementsByClassName('pve-info');
  }

  constructor() {
    super('top-bar-overlay');
  }

  protected listenOnEvents() {
    Array.from(this.pveInfos).forEach((pveInfo) => ((pveInfo as HTMLElement).style.visibility = 'hidden'));
    this.pauseGameButton.style.display = 'none';
    this.continueGameButton.style.display = 'none';

    this.endGameButton.addEventListener('click', () => this.emit('endGameButtonClick'), { signal: this.abortSignal });
    this.pauseGameButton.addEventListener(
      'click',
      () => {
        this.emit('pauseGameButtonClick');
        this.continueGameButton.style.display = 'inline';
        this.pauseGameButton.style.display = 'none';
      },
      { signal: this.abortSignal }
    );
    this.continueGameButton.addEventListener(
      'click',
      () => {
        this.emit('continueGameButtonClick');
        this.pauseGameButton.style.display = 'inline';
        this.continueGameButton.style.display = 'none';
      },
      { signal: this.abortSignal }
    );
  }

  onPlay(gameMode: GameMode) {
    this.pauseGameButton.style.display = 'inline';

    if (gameMode !== 'PVP') {
      Array.from(this.pveInfos).forEach((pveInfo) => ((pveInfo as HTMLElement).style.visibility = 'visible'));
    }
  }
}
