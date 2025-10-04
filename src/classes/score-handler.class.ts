import { EVERY_SPECIAL_APPLE_COUNT } from '../constants/settings.constants';
import { TopBarOverlay } from './overlays/top-bar.overlay';

export class ScoreHandler {
  private _score!: number;
  private _appleCount!: number;

  private topBarOverlay: TopBarOverlay;

  get score(): number {
    return this._score;
  }

  get appleCount(): number {
    return this._appleCount;
  }

  set score(newScore: number) {
    this._score = newScore;
    this.topBarOverlay.currentScoreText.textContent = newScore.toString();
  }

  set appleCount(newCount: number) {
    this._appleCount = newCount;
    this.topBarOverlay.appleCountText.textContent = newCount.toString();
  }

  constructor(topBarOverlay: TopBarOverlay) {
    this.topBarOverlay = topBarOverlay;
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
