import { EVERY_SPECIAL_APPLE_COUNT } from '../constants/settings.constants';

export class ScoreHandler {
  _score!: number;
  _appleCount!: number;

  private readonly currentScoreText = document.getElementById('current-score') as HTMLSpanElement;
  private readonly appleCountText = document.getElementById('apple-count') as HTMLSpanElement;

  get score(): number {
    return this._score;
  }

  get appleCount(): number {
    return this._appleCount;
  }

  set score(newScore: number) {
    this._score = newScore;
    this.currentScoreText.textContent = newScore.toString();
  }

  set appleCount(newCount: number) {
    this._appleCount = newCount;
    this.appleCountText.textContent = newCount.toString();
  }

  constructor() {
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
}
