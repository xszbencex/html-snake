import { BaseOverlay } from './base.overlay';

export class GamePausedOverlay extends BaseOverlay {
  constructor() {
    super('game-paused-overlay');
  }

  protected listenOnEvents() {}
}
