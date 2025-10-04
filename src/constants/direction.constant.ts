import { Player1Key, Player2Key } from '../types/direction-key.type';
import { Direction } from '../types/direction.type';

export const DIRECTION_KEYS: Record<Direction, readonly [Player1Key, Player2Key]> = {
  UP: ['ArrowUp', 'w'],
  DOWN: ['ArrowDown', 's'],
  LEFT: ['ArrowLeft', 'a'],
  RIGHT: ['ArrowRight', 'd'],
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export const DIRECTION_ROTATION: Record<Direction, number> = {
  UP: (3 * Math.PI) / 2,
  DOWN: Math.PI / 2,
  LEFT: Math.PI,
  RIGHT: 0,
};
