import { Apple } from '../classes/apple.class';
import { Snake } from '../classes/snake.class';

export interface AppleEatenInfo {
  eatenApple: Apple;
  eatenBySnake: Snake;
}
