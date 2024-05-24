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

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
