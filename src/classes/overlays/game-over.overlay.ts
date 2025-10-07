import { Snake } from '../snake.class';
import { BaseOverlay } from './base.overlay';

export class GameOverOverlay extends BaseOverlay {
  private get restartButton() {
    return document.getElementById('restart-game-button') as HTMLButtonElement;
  }

  private get mainMenuButton() {
    return document.getElementById('main-menu-button') as HTMLButtonElement;
  }

  get finalScoreContainer() {
    return document.getElementById('final-score-container') as HTMLDivElement;
  }

  get finalScoreText() {
    return document.getElementById('final-score') as HTMLSpanElement;
  }

  get finalAppleCountText() {
    return document.getElementById('final-apple-count') as HTMLSpanElement;
  }

  get winnerContainer() {
    return document.getElementById('winner-container') as HTMLDivElement;
  }

  get drawText() {
    return document.getElementById('draw-text') as HTMLHeadingElement;
  }

  get winnerText() {
    return document.getElementById('winner-text') as HTMLHeadingElement;
  }

  constructor() {
    super('game-over-overlay');
  }

  protected listenOnEvents() {
    this.finalScoreContainer.style.display = 'none';
    this.winnerContainer.style.display = 'none';
    this.drawText.style.display = 'none';
    this.winnerText.style.display = 'none';
    this.restartButton.addEventListener('click', () => this.emit('restartButtonClick'), { signal: this.abortSignal });
    this.mainMenuButton.addEventListener('click', () => this.emit('mainMenuButtonClick'), { signal: this.abortSignal });
  }

  onGameEnd(finalScore: number, finalAppleCount: number, winners: Snake[] | undefined) {
    if (winners) {
      this.winnerContainer.style.display = 'block';

      if (winners.length === 0) {
        this.drawText.style.display = 'block';
      } else {
        this.winnerText.style.display = 'block';
        this.winnerText.innerText = `Player ${winners[0].index + 1} wins`;
      }
    } else {
      this.finalScoreContainer.style.display = 'flex';
      this.finalScoreText.textContent = finalScore.toString();
      this.finalAppleCountText.textContent = finalAppleCount.toString();
    }
  }
}
