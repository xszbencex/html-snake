import { MAX_MAP_SIZE, MAX_SPEED, MIN_MAP_SIZE, MIN_SPEED } from '../../constants/settings.constants';
import { GameMode } from '../../types/game-mode.type';
import { BaseOverlay } from './base.overlay';

export class SettingsOverlay extends BaseOverlay {
  private get backButton() {
    return document.getElementById('back-button') as HTMLButtonElement;
  }

  private get restoreDefaultsButton() {
    return document.getElementById('restore-defaults-button') as HTMLButtonElement;
  }

  get gameModeSelect() {
    return document.getElementById('game-mode-select') as HTMLSelectElement;
  }

  get speedRangeInput() {
    return document.getElementById('speed-range') as HTMLInputElement;
  }

  get mapSizeRangeInput() {
    return document.getElementById('map-size-range') as HTMLInputElement;
  }

  get canGoThroughWallsCheckboxInput() {
    return document.getElementById('walls-checkbox') as HTMLInputElement;
  }

  get volumeRangeInput() {
    return document.getElementById('music-volume-range') as HTMLInputElement;
  }

  constructor() {
    super('settings-overlay');
    this.speedRangeInput.min = MIN_SPEED.toString();
    this.speedRangeInput.max = MAX_SPEED.toString();
    this.mapSizeRangeInput.min = MIN_MAP_SIZE.toString();
    this.mapSizeRangeInput.max = MAX_MAP_SIZE.toString();
  }

  protected listenOnEvents() {
    this.backButton.addEventListener('click', () => this.emit('settingsBackButtonClick'), { signal: this.abortSignal });
    this.restoreDefaultsButton.addEventListener('click', () => this.emit('restoreDefaultsButtonClick'), {
      signal: this.abortSignal,
    });

    this.gameModeSelect.addEventListener(
      'change',
      (e: Event) => this.emit('gameModeChange', (e.target as HTMLInputElement).value as GameMode),
      { signal: this.abortSignal }
    );

    this.speedRangeInput.addEventListener('change', (e: Event) =>
      this.emit('speedChange', Number((e.target as HTMLInputElement).value), { signal: this.abortSignal })
    );

    this.mapSizeRangeInput.addEventListener(
      'change',
      (e: Event) => (this.emit('mapSizeChange', Number((e.target as HTMLInputElement).value)), { signal: this.abortSignal })
    );

    this.canGoThroughWallsCheckboxInput.addEventListener(
      'change',
      (e: Event) => this.emit('canGoThroughWallsChange', (e.target as HTMLInputElement).checked),
      { signal: this.abortSignal }
    );

    this.volumeRangeInput.addEventListener('change', (e: Event) =>
      this.emit('volumeChange', Number((e.target as HTMLInputElement).value), { signal: this.abortSignal })
    );
  }
}
