import { Direction } from '../types/direction.type';

export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(direction: Direction) {
    switch (direction) {
      case 'UP':
        this.y -= 1;
        break;
      case 'DOWN':
        this.y += 1;
        break;
      case 'RIGHT':
        this.x += 1;
        break;
      case 'LEFT':
        this.x -= 1;
        break;
    }
  }

  moveWithWallWalkthrough(direction: Direction, maxWidth: number, maxHeight: number) {
    switch (direction) {
      case 'UP':
        this.y -= 1;
        break;
      case 'DOWN':
        this.y += 1;
        break;
      case 'RIGHT':
        this.x += 1;
        break;
      case 'LEFT':
        this.x -= 1;
        break;
    }

    if (this.x < 0) {
      this.x = maxWidth - 1;
    }

    if (this.x >= maxWidth) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = maxHeight - 1;
    }
    if (this.y >= maxHeight) {
      this.y = 0;
    }
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
