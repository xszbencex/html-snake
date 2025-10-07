export interface PveHighScore {
  readonly score: number;
  readonly appleCount: number;
  readonly timestamp: string;
}

export interface HighScores {
  readonly pvpWins: number[];
  readonly pveHighScores: PveHighScore[];
  readonly singlePlayerHighScores: PveHighScore[];
}
