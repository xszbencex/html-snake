export type GameMode = 'SINGLE_PLAYER' | 'PVP' | 'PVE';

export const GameMode: Record<GameMode, GameMode> = {
  SINGLE_PLAYER: 'SINGLE_PLAYER',
  PVP: 'PVP',
  PVE: 'PVE',
};
