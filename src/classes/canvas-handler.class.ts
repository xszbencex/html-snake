import { DIRECTION_ROTATION } from '../constants/direction.constant';
import { RESOLUTION } from '../constants/settings.constants';
import { getSnakeCornerRotation } from '../utils/canvas.utils';
import { Apple } from './apple.class';
import { ImageHandler } from './image-handler.class';
import { SnakeBody } from './snake-body.class';
import { Snake } from './snake.class';

export class CanvasHandler {
  canvas: HTMLCanvasElement;
  private imageHandler = new ImageHandler();

  get context() {
    return this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async preloadImages(): Promise<void> {
    return this.imageHandler.preloadImages();
  }

  resizeCanvas(mapSize: number) {
    this.canvas.width = mapSize * RESOLUTION;
    this.canvas.height = mapSize * RESOLUTION;
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackgroundGrid(mapSize: number) {
    for (let x = 0; x < mapSize; x++) {
      for (let y = 0; y < mapSize; y++) {
        this.context.fillStyle = (x + y) % 2 ? '#82b62225' : '#ecf87f1b';
        this.context.fillRect(x * RESOLUTION, y * RESOLUTION, RESOLUTION, RESOLUTION);
      }
    }
  }

  drawSnake(snake: Snake) {
    snake.snakeParts.forEach((snakePart: SnakeBody, index: number, snakeParts: SnakeBody[]) => {
      if (index === 0) {
        this.drawImageWithRotation(this.imageHandler.snakeHeadImage, snakePart, DIRECTION_ROTATION[snakePart.direction!], snake.color);
      } else if (index === snakeParts.length - 1) {
        this.drawImageWithRotation(this.imageHandler.snakeTailImage, snakePart, DIRECTION_ROTATION[snakePart.direction!], snake.color);
      } else {
        const previousPart = snakeParts[index + 1];
        const nextPart = snakeParts[index - 1];

        const isStraightHorizontal = previousPart.y === snakePart.y && nextPart.y === snakePart.y;
        const isStraightVertical = previousPart.x === snakePart.x && nextPart.x === snakePart.x;

        if (isStraightHorizontal || isStraightVertical) {
          this.drawImageWithRotation(this.imageHandler.snakeBodyImage, snakePart, DIRECTION_ROTATION[snakePart.direction!], snake.color);
        } else {
          this.drawImageWithRotation(
            this.imageHandler.snakeBodyCornerImage,
            snakePart,
            getSnakeCornerRotation(snakePart.direction!, previousPart.direction!),
            snake.color
          );
        }
      }
    });
  }

  drawApple(apple: Apple, deltaTime: number = 0) {
    apple.animate(deltaTime);
    const size = RESOLUTION * apple.scale;
    const offset = (RESOLUTION - size) / 2;

    this.context.drawImage(this.imageHandler.appleImage, apple.x * RESOLUTION + offset, apple.y * RESOLUTION + offset, size, size);
  }

  private drawImageWithRotation(image: HTMLImageElement, snakePart: SnakeBody, rotation: number, color: string) {
    const x = snakePart.x * RESOLUTION;
    const y = snakePart.y * RESOLUTION;
    const width = RESOLUTION;
    const height = RESOLUTION;

    const cx = x + width / 2;
    const cy = y + height / 2;

    this.context.save();

    this.context.translate(cx, cy);

    if (rotation) this.context.rotate(rotation);
    this.context.filter = color;

    this.context.drawImage(image, -width / 2, -height / 2, width, height);

    this.context.restore();
  }
}
