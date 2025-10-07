import { EVERY_SPECIAL_APPLE_COUNT, HIGH_SCORES_LOCALSTORAGE_KEY, HIGH_SCORES_MAX_LENGTH } from '../constants/settings.constants';
import { HighScores, PveHighScore } from '../interfaces/high-scores.interface';
import { GameMode } from '../types/game-mode.type';
import { ScoreboardOverlay } from './overlays/scoreboard.overlay';
import { TopBarOverlay } from './overlays/top-bar.overlay';
import { Snake } from './snake.class';

export class ScoreHandler {
  private _score!: number;
  private _appleCount!: number;
  private _highScores!: HighScores;

  private topBarOverlay: TopBarOverlay;
  private scoreboardOverlay: ScoreboardOverlay;

  get score(): number {
    return this._score;
  }

  get appleCount(): number {
    return this._appleCount;
  }

  get highScores(): HighScores {
    return this._highScores;
  }

  set score(newScore: number) {
    this._score = newScore;
    this.topBarOverlay.currentScoreText.textContent = newScore.toString();
  }

  set appleCount(newCount: number) {
    this._appleCount = newCount;
    this.topBarOverlay.appleCountText.textContent = newCount.toString();
  }

  set highScores(newHighScores: HighScores) {
    this._highScores = newHighScores;
    localStorage.setItem(HIGH_SCORES_LOCALSTORAGE_KEY, JSON.stringify(newHighScores));
  }

  constructor(topBarOverlay: TopBarOverlay, scoreboardOverlay: ScoreboardOverlay) {
    this.topBarOverlay = topBarOverlay;
    this.scoreboardOverlay = scoreboardOverlay;

    const initialHighScores: HighScores = {
      pvpWins: [],
      pveHighScores: [],
      singlePlayerHighScores: [],
    };

    this.highScores = JSON.parse(localStorage.getItem(HIGH_SCORES_LOCALSTORAGE_KEY) ?? JSON.stringify(initialHighScores));
    this.scoreboardOverlay.on('scoreGameModeChange', (gameMode: GameMode) => this.showHighScores(gameMode));
    this.initialize();
  }

  initialize() {
    this.score = 0;
    this.appleCount = 0;
  }

  increaseScore(gameSpeed: number, appleBaseScale: number) {
    ++this.appleCount;
    this.score = Math.floor(this.score + gameSpeed * Math.pow(appleBaseScale, 2));
  }

  isNextAppleSpecial(): boolean {
    return (this.appleCount + 1) % EVERY_SPECIAL_APPLE_COUNT === 0;
  }

  showHighScores(gameMode: GameMode) {
    switch (gameMode) {
      case 'PVE':
        this.scoreboardOverlay.showPveScores(this.highScores.pveHighScores);
        break;
      case 'SINGLE_PLAYER':
        this.scoreboardOverlay.showPveScores(this.highScores.singlePlayerHighScores);
        break;
      case 'PVP':
      default:
        this.scoreboardOverlay.showPvpScores(this.highScores.pvpWins);
    }
  }

  storeScore(gameMode: GameMode, winners?: Snake[]) {
    const { pveHighScores, pvpWins, singlePlayerHighScores } = this.highScores;

    switch (gameMode) {
      case 'PVE':
        this.addPveHighScore(pveHighScores);
        break;
      case 'SINGLE_PLAYER':
        this.addPveHighScore(singlePlayerHighScores);
        break;
      case 'PVP':
      default:
        if (winners && winners.length === 1) {
          pvpWins[winners[0].index] = (pvpWins[winners[0].index] ?? 0) + 1;
        }
    }

    this.highScores = {
      pveHighScores,
      pvpWins,
      singlePlayerHighScores,
    };
  }

  private addPveHighScore(currentHighScores: PveHighScore[]) {
    currentHighScores.push({ appleCount: this.appleCount, score: this.score, timestamp: new Date().toLocaleDateString() });
    currentHighScores.sort((a, b) => b.score - a.score);
    if (currentHighScores.length > HIGH_SCORES_MAX_LENGTH) currentHighScores.length = HIGH_SCORES_MAX_LENGTH;
  }
}
