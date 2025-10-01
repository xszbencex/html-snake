import { DEFAULT_SNAKE_LENGTH, SNAKE_START_PLACEMENT_THRESHOLD } from '../constants/settings.constants';
import { Direction } from '../types/direction.type';
import { checkSnakeAppleCollision } from '../utils/canvas.utils';
import { randomIntFromInterval } from '../utils/random.util';
import { Apple } from './apple.class';
import { Coordinate } from './coordinate.class';
import { GameSettings } from './game-settings.class';
import { SnakeBody } from './snake-body.class';

export class ObjectHandler {
  gameSettings: GameSettings;
  snake: SnakeBody[] = [];
  snakeHead!: SnakeBody;
  apple!: Apple;

  constructor(direction: Direction, gameSettings: GameSettings) {
    this.gameSettings = gameSettings;
    this.initialize(direction);
  }

  initialize(direction: Direction) {
    this.placeSnake(direction);
    this.placeApple();
  }

  placeSnake(direction: Direction) {
    this.snake = [];
    this.snakeHead = new SnakeBody(
      new Coordinate(
        randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, this.gameSettings.mapSize - 1 - SNAKE_START_PLACEMENT_THRESHOLD),
        randomIntFromInterval(SNAKE_START_PLACEMENT_THRESHOLD, this.gameSettings.mapSize - 1 - SNAKE_START_PLACEMENT_THRESHOLD)
      ),
      direction
    );
    this.snake.push(this.snakeHead);
    for (let i = 1; i < DEFAULT_SNAKE_LENGTH; i++) {
      this.snake.push(new SnakeBody(new Coordinate(this.snakeHead.x - i, this.snakeHead.y), direction));
    }
  }

  placeApple(isSpecial: boolean = false) {
    let isSnakePart = true;

    while (isSnakePart) {
      this.apple = new Apple(
        new Coordinate(randomIntFromInterval(0, this.gameSettings.mapSize - 1), randomIntFromInterval(0, this.gameSettings.mapSize - 1)),
        isSpecial
      );

      isSnakePart = this.snake.some((snakePart: SnakeBody) => snakePart.x === this.apple.x && snakePart.y === this.apple.y);
    }
  }

  moveSnake(direction: Direction) {
    this.snakeHead.direction = direction;

    for (let i = this.snake.length - 1; i > 0; i--) {
      const currentPart = this.snake[i];
      currentPart.coordinates.x = this.snake[i - 1].coordinates.x;
      currentPart.coordinates.y = this.snake[i - 1].coordinates.y;
      currentPart.direction = this.snake[i - 1].direction;
    }

    if (this.gameSettings.canGoThroughWalls) {
      this.snakeHead.moveWithWallWalkthrough(direction, this.gameSettings.mapSize, this.gameSettings.mapSize);
    } else {
      this.snakeHead.move(direction);
    }
  }

  checkSnakeCollision() {
    const isBorderCollision =
      this.snakeHead.x >= this.gameSettings.mapSize ||
      this.snakeHead.x < 0 ||
      this.snakeHead.y >= this.gameSettings.mapSize ||
      this.snakeHead.y < 0;

    const isSelfCollision =
      this.snake.filter((snakePart: SnakeBody) => snakePart.x === this.snakeHead.x && snakePart.y === this.snakeHead.y).length === 2;

    if ((!this.gameSettings.canGoThroughWalls && isBorderCollision) || isSelfCollision) {
      return true;
    }

    return false;
  }

  checkAppleEating(): boolean {
    const isAppleEaten = checkSnakeAppleCollision(this.apple, this.snakeHead);

    if (isAppleEaten) {
      this.placeApple();

      return true;
    }

    return false;
  }
}
