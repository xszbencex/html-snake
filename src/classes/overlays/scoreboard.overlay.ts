import { PveHighScore } from '../../interfaces/high-scores.interface';
import { GameMode } from '../../types/game-mode.type';
import { BaseOverlay } from './base.overlay';

export class ScoreboardOverlay extends BaseOverlay {
  private get backButton() {
    return document.getElementById('scoreboard-back-button') as HTMLButtonElement;
  }

  get pvpScore() {
    return document.getElementById('pvp-score') as HTMLDivElement;
  }

  get pveScore() {
    return document.getElementById('pve-score') as HTMLDivElement;
  }

  get noScoresText() {
    return document.getElementById('no-scores-text') as HTMLHeadElement;
  }

  get scoreboardTableBody() {
    return document.getElementById('scoreboard-table-body') as HTMLDivElement;
  }

  get scoreGameModeSelect() {
    return document.getElementById('score-game-mode-select') as HTMLSelectElement;
  }

  constructor() {
    super('scoreboard-overlay');
  }

  protected listenOnEvents() {
    this.clearAll();
    this.backButton.addEventListener('click', () => this.emit('backButtonClick'), { signal: this.abortSignal });

    this.scoreGameModeSelect.addEventListener(
      'change',
      (e: Event) => this.emit('scoreGameModeChange', (e.target as HTMLInputElement).value as GameMode),
      { signal: this.abortSignal }
    );
  }

  showPvpScores(wins: number[]) {
    this.clearAll();

    if (wins.length > 0) {
      this.pvpScore.style.display = 'flex';

      wins.forEach((numberOfWin, index) => {
        const scoreElement = document.createElement('h3');
        scoreElement.innerText = `Player ${index + 1} wins: ${numberOfWin ?? 0}`;
        this.pvpScore.appendChild(scoreElement);
      });
    } else {
      this.noScoresText.style.display = 'block';
    }
  }

  showPveScores(highScores: PveHighScore[]) {
    this.clearAll();

    if (highScores.length > 0) {
      this.pveScore.style.display = 'block';

      highScores.forEach((highScore, index) => {
        const tableRowElement = document.createElement('tr');
        const indexCellElement = document.createElement('td');
        const scoreCellElement = document.createElement('td');
        const appleCountCellElement = document.createElement('td');

        indexCellElement.innerText = `${index + 1}.`;
        scoreCellElement.innerText = highScore.score.toString();
        appleCountCellElement.innerText = highScore.appleCount.toString();

        tableRowElement.appendChild(indexCellElement);
        tableRowElement.appendChild(scoreCellElement);
        tableRowElement.appendChild(appleCountCellElement);

        this.scoreboardTableBody.appendChild(tableRowElement);
      });
    } else {
      this.noScoresText.style.display = 'block';
    }
  }

  private clearAll() {
    this.noScoresText.style.display = 'none';
    this.pvpScore.style.display = 'none';
    this.pveScore.style.display = 'none';
    this.pvpScore.innerHTML = '';
    this.scoreboardTableBody.innerHTML = '';
  }
}
