import { Direction } from '../types/direction.type';

export class Coordinate {
  static fromCoordinate(coordinate: Coordinate): Coordinate {
    return new Coordinate(coordinate.x, coordinate.y);
  }

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(direction: Direction, mapSize: number, canGoThroughWalls: boolean) {
    this.moveInDirection(direction);

    if (!canGoThroughWalls) {
      return;
    }

    if (this.x < 0) {
      this.x = mapSize - 1;
    }

    if (this.x >= mapSize) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = mapSize - 1;
    }
    if (this.y >= mapSize) {
      this.y = 0;
    }
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(coordinate: Coordinate): boolean {
    return this.x === coordinate.x && this.y === coordinate.y;
  }

  isWithinThreshold(coordinate: Coordinate, threshold: number) {
    const dx = this.x - coordinate.x;
    const dy = this.y - coordinate.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= threshold;
  }

  private moveInDirection(direction: Direction) {
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
}
