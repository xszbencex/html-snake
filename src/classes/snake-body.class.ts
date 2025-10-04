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

  move(mapSize: number, canGoThroughWalls: boolean) {
    this.coordinates.move(this.direction, mapSize, canGoThroughWalls);
  }
}
