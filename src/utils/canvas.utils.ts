import { Apple } from '../classes/apple.class';
import { SnakeBody } from '../classes/snake-body.class';
import { RESOLUTION } from '../constants/settings.constants';
import { Direction } from '../types/direction.type';

export function checkSnakeAppleCollision(apple: Apple, snakeHead: SnakeBody): boolean {
  const size = RESOLUTION * apple.scale;
  const offset = (RESOLUTION - size) / 2;

  const appleRect = {
    x: apple.x * RESOLUTION + offset,
    y: apple.y * RESOLUTION + offset,
    w: size,
    h: size,
  };

  const headRect = {
    x: snakeHead.x * RESOLUTION,
    y: snakeHead.y * RESOLUTION,
    w: RESOLUTION,
    h: RESOLUTION,
  };

  return !(
    headRect.x + headRect.w < appleRect.x ||
    headRect.x > appleRect.x + appleRect.w ||
    headRect.y + headRect.h < appleRect.y ||
    headRect.y > appleRect.y + appleRect.h
  );
}

export function getSnakeCornerRotation(currentDirection: Direction, previousPartDirection: Direction): number {
  if (currentDirection === 'DOWN' && previousPartDirection === 'LEFT') return Math.PI / 2;
  if (currentDirection === 'RIGHT' && previousPartDirection === 'UP') return Math.PI / 2;
  if (currentDirection === 'DOWN' && previousPartDirection === 'RIGHT') return Math.PI;
  if (currentDirection === 'LEFT' && previousPartDirection === 'UP') return Math.PI;
  if (currentDirection === 'UP' && previousPartDirection === 'RIGHT') return (3 * Math.PI) / 2;
  if (currentDirection === 'LEFT' && previousPartDirection === 'DOWN') return (3 * Math.PI) / 2;

  return 0;
}
