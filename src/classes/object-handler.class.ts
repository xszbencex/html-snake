import { DEFAULT_SNAKE_LENGTH } from '../constants/settings.constants';
import { AppleEatenInfo } from '../interfaces/apple-eaten-info.interface';
import { checkSnakeAppleCollision } from '../utils/canvas.utils';
import { randomIntFromInterval } from '../utils/random.util';
import { Apple } from './apple.class';
import { Coordinate } from './coordinate.class';
import { GameSettings } from './game-settings.class';
import { Snake } from './snake.class';

export class ObjectHandler {
  gameSettings: GameSettings;
  snakes: Snake[] = [];
  apples: Apple[] = [];

  constructor(gameSettings: GameSettings) {
    this.gameSettings = gameSettings;
  }

  clear() {
    this.snakes = [];
    this.apples = [];
  }

  initialize() {
    this.clear();

    this.placeSnakes();
    this.placeApples();
  }

  moveSnakes() {
    this.snakes.forEach((snake) => snake.move(this.gameSettings));
  }

  checkSnakeCollision(): Snake[] {
    return this.snakes.filter((snake, index, array) => {
      const isBorderCollision =
        snake.head.x >= this.gameSettings.mapSize || snake.head.x < 0 || snake.head.y >= this.gameSettings.mapSize || snake.head.y < 0;

      const isSelfCollision = snake.hasSelfCollision();

      const otherSnakes = array.filter((_, i) => i !== index);
      const hasOtherSnakeCollision = otherSnakes.some((otherSnake) => otherSnake.isCoordinatePartOfSnake(snake.head.coordinates));

      if ((!this.gameSettings.canGoThroughWalls && isBorderCollision) || isSelfCollision || hasOtherSnakeCollision) {
        return true;
      }

      return false;
    });
  }

  checkAppleEating(): AppleEatenInfo[] {
    const eatenInfo: AppleEatenInfo[] = [];

    for (let snake of this.snakes) {
      for (let apple of this.apples) {
        const isAppleEaten = checkSnakeAppleCollision(apple, snake.head);
        if (isAppleEaten) {
          eatenInfo.push({ eatenApple: apple, eatenBySnake: snake });
        }
      }
    }

    return eatenInfo;
  }

  replaceApple(appleToReplace: Apple, isNextAppleSpecial: boolean) {
    const indexToReplace = this.apples.findIndex((apple) => apple.equals(appleToReplace));

    this.apples[indexToReplace] = new Apple(this.getRandomFreeCoordinate(), isNextAppleSpecial);
  }

  isEverySnakeReady(): boolean {
    return this.snakes.every((snake) => snake.isReady);
  }

  private placeSnakes() {
    for (let i = 0; i < this.gameSettings.numberOfPlayers; i++) {
      const color = i % 2 === 0 ? 'none' : 'hue-rotate(325deg)';
      this.snakes.push(new Snake(this.getRandomFreeCoordinate(DEFAULT_SNAKE_LENGTH), this.gameSettings, color, i));
    }
  }

  private placeApples(isSpecial: boolean = false) {
    for (let i = 0; i < this.gameSettings.numberOfPlayers; i++) {
      this.apples.push(new Apple(this.getRandomFreeCoordinate(), isSpecial));
    }
  }

  private getAvailableCoordinates(borderThreshold: number = 0): Coordinate[] {
    const availableCoordinates = [];

    for (let x = borderThreshold; x < this.gameSettings.mapSize - borderThreshold; x++) {
      for (let y = borderThreshold; y < this.gameSettings.mapSize - borderThreshold; y++) {
        const coordinate = new Coordinate(x, y);

        const isAppleCoordinate = this.apples.some((apple) => apple.coordinates.equals(coordinate));
        const isSnakeSurrounding = this.snakes.some((snake) =>
          borderThreshold
            ? snake.head.coordinates.isWithinThreshold(coordinate, borderThreshold)
            : snake.isCoordinatePartOfSnake(coordinate)
        );

        if (isAppleCoordinate || isSnakeSurrounding) {
          continue;
        }

        availableCoordinates.push(coordinate);
      }
    }

    return availableCoordinates;
  }

  private getRandomFreeCoordinate(borderThreshold: number = 0): Coordinate {
    const availableCoordinates = this.getAvailableCoordinates(borderThreshold);

    return availableCoordinates[randomIntFromInterval(0, availableCoordinates.length - 1)];
  }
}
