import { DIRECTIONS } from '../types/direction.type';

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomDirection() {
  const randomIndex = Math.floor(Math.random() * DIRECTIONS.length);
  return DIRECTIONS[randomIndex];
}
