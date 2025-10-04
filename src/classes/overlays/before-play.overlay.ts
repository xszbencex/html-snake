import { GameMode } from '../../types/game-mode.type';
import { Snake } from '../snake.class';
import { BaseOverlay } from './base.overlay';

export class BeforePlayOverlay extends BaseOverlay {
  get singlePlayerHint() {
    return document.getElementById('single-player-hint') as HTMLDivElement;
  }

  get multiplayerHint() {
    return document.getElementById('multiplayer-hint') as HTMLDivElement;
  }

  get tickContainers() {
    return document.getElementsByClassName('tick-container');
  }

  get snakeHeadIcons() {
    return document.getElementsByClassName('snake-head-icon');
  }

  constructor() {
    super('before-play-overlay');
  }

  protected listenOnEvents() {
    Array.from(this.tickContainers).forEach((element) => element.classList.remove('ticked'));
  }

  showHint(gameMode: GameMode, snakes: Snake[]) {
    if (gameMode === 'SINGLE_PLAYER') {
      this.singlePlayerHint.style.display = 'flex';
      this.multiplayerHint.style.display = 'none';
    } else {
      this.singlePlayerHint.style.display = 'none';
      this.multiplayerHint.style.display = 'flex';
      Array.from(this.snakeHeadIcons).forEach((element, index) => ((element as HTMLElement).style.filter = snakes[index].color));
    }
  }

  tickPlayerHint(playerIndex: number) {
    document.getElementsByClassName('tick-container')[playerIndex]?.classList?.add('ticked');
  }
}
