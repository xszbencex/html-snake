import { loadImage } from '../utils/load-assets.utils';

export class ImageHandler {
  appleImage!: HTMLImageElement;
  snakeBodyImage!: HTMLImageElement;
  snakeBodyCornerImage!: HTMLImageElement;
  snakeHeadImage!: HTMLImageElement;
  snakeTailImage!: HTMLImageElement;

  async preloadImages(): Promise<void> {
    this.appleImage = await loadImage('/apple.png');
    this.snakeBodyImage = await loadImage('/snake-body.png');
    this.snakeBodyCornerImage = await loadImage('/snake-body-corner.png');
    this.snakeHeadImage = await loadImage('/snake-head.png');
    this.snakeTailImage = await loadImage('/snake-tail.png');
  }
}
