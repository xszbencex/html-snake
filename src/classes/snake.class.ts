import { OPPOSITE_DIRECTION } from '../constants/direction.constant';
import { DEFAULT_SNAKE_LENGTH } from '../constants/settings.constants';
import { Direction } from '../types/direction.type';
import { randomDirection } from '../utils/random.util';
import { Coordinate } from './coordinate.class';
import { GameSettings } from './game-settings.class';
import { SnakeBody } from './snake-body.class';

export class Snake {
  snakeParts: SnakeBody[] = [];
  direction: Direction;
  color: string;
  isReady: boolean = false;
  index: number;

  get head(): SnakeBody {
    return this.snakeParts[0];
  }

  constructor(snakeHeadCoordinate: Coordinate, gameSettings: GameSettings, color: string, index: number) {
    this.direction = randomDirection();
    this.color = color;
    this.index = index;

    this.initializeSnake(snakeHeadCoordinate, gameSettings);
  }

  move(gameSettings: GameSettings) {
    this.head.direction = this.direction;

    for (let i = this.snakeParts.length - 1; i > 0; i--) {
      const currentPart = this.snakeParts[i];
      currentPart.coordinates.x = this.snakeParts[i - 1].coordinates.x;
      currentPart.coordinates.y = this.snakeParts[i - 1].coordinates.y;
      currentPart.direction = this.snakeParts[i - 1].direction;
    }

    this.head.move(gameSettings.mapSize, gameSettings.canGoThroughWalls);
  }

  increaseSnakeLength(gameSettings: GameSettings) {
    const snakeTail = this.snakeParts[this.snakeParts.length - 1];
    const snakeTailCoordinates = Coordinate.fromCoordinate(snakeTail.coordinates);

    snakeTailCoordinates.move(OPPOSITE_DIRECTION[snakeTail.direction], gameSettings.mapSize, gameSettings.canGoThroughWalls);

    this.snakeParts.push(new SnakeBody(snakeTailCoordinates, snakeTail.direction));
  }

  isCoordinatePartOfSnake(coordinate: Coordinate): boolean {
    return this.snakeParts.some((snakeBody) => snakeBody.coordinates.equals(coordinate));
  }

  hasSelfCollision(): boolean {
    return this.snakeParts.filter((snakePart: SnakeBody) => snakePart.x === this.head.x && snakePart.y === this.head.y).length === 2;
  }

  private initializeSnake(snakeHeadCoordinate: Coordinate, gameSettings: GameSettings) {
    const snakeHead = new SnakeBody(snakeHeadCoordinate, this.direction);
    this.snakeParts.push(snakeHead);

    for (let i = 1; i < DEFAULT_SNAKE_LENGTH; i++) {
      const snakePartCoordinate = Coordinate.fromCoordinate(snakeHead.coordinates);
      for (let j = 0; j < i; j++) {
        snakePartCoordinate.move(OPPOSITE_DIRECTION[this.direction], gameSettings.mapSize, gameSettings.canGoThroughWalls);
      }
      this.snakeParts.push(new SnakeBody(snakePartCoordinate, this.direction));
    }
  }
}
