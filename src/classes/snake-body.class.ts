import { Direction } from '../types/direction.type';
import { Coordinate } from './coordinate.class';

export class SnakeBody {
  coordinates: Coordinate;
  direction: Direction;

  constructor(coordinates: Coordinate, direction: Direction) {
    this.coordinates = coordinates;
    this.direction = direction;
  }

  get x(): number {
    return this.coordinates.x;
  }

  get y(): number {
    return this.coordinates.y;
  }

  move(direction: Direction) {
    this.coordinates.move(direction);
  }

  moveWithWallWalkthrough(direction: Direction, maxWidth: number, maxHeight: number) {
    this.coordinates.moveWithWallWalkthrough(direction, maxWidth, maxHeight);
  }
}
