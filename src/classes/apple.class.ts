import { Coordinate } from './coordinate.class';

export class Apple {
  static SPECIAL_APPLE_SCALE = 3;

  coordinates: Coordinate;
  baseScale: number;
  scale: number = 1;

  private pulseTime: number = 0;

  constructor(coordinates: Coordinate, isSpecial: boolean) {
    this.coordinates = coordinates;
    this.baseScale = isSpecial ? Apple.SPECIAL_APPLE_SCALE : 1;
  }

  get x(): number {
    return this.coordinates.x;
  }

  get y(): number {
    return this.coordinates.y;
  }

  animate(deltaTime: number) {
    this.pulseTime += deltaTime * 0.0005;

    if (this.baseScale > 1) {
      this.baseScale = Math.max(1, this.baseScale - 0.001);
    } else {
      this.baseScale = 1;
    }

    const amplitude = this.baseScale > 1 ? 0.3 : 0.05;
    const pulse = (Math.cos(this.pulseTime) - 1) * 0.5 * amplitude;

    this.scale = this.baseScale + pulse;
  }
}
