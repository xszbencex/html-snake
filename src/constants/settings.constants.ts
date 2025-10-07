import { GameMode } from '../types/game-mode.type';

export const MIN_MAP_SIZE = 12;
export const MAX_MAP_SIZE = 25;
export const DEFAULT_MAP_SIZE = 15;
export const MIN_SPEED = 8;
export const MAX_SPEED = 20;
export const DEFAULT_SPEED = 12;
export const DEFAULT_VOLUME = 0.5;
export const DEFAULT_CAN_GO_THROUGH_WALLS = true;
export const DEFAULT_GAME_MODE: GameMode = 'SINGLE_PLAYER';

export const SPEED_LOCALSTORAGE_KEY = 'speed';
export const MAP_SIZE_LOCALSTORAGE_KEY = 'mapSize';
export const MUSIC_VOLUME_LOCALSTORAGE_KEY = 'musicVolume';
export const CAN_GO_THROUGH_WALLS_LOCALSTORAGE_KEY = 'canGoThroughWalls';
export const GAME_MODE_LOCALSTORAGE_KEY = 'gameMode';
export const HIGH_SCORES_LOCALSTORAGE_KEY = 'highScores';

export const RESOLUTION = 50;
export const DEFAULT_SNAKE_LENGTH = 3;
export const EVERY_SPECIAL_APPLE_COUNT = 10;
export const SPECIAL_APPLE_SCALE = 3;

export const HIGH_SCORES_MAX_LENGTH = 5;
