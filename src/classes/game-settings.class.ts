import {
  CAN_GO_THROUGH_WALLS_LOCALSTORAGE_KEY,
  DEFAULT_CAN_GO_THROUGH_WALLS,
  DEFAULT_MAP_SIZE,
  DEFAULT_SPEED,
  DEFAULT_VOLUME,
  MAP_SIZE_LOCALSTORAGE_KEY,
  MAX_MAP_SIZE,
  MAX_SPEED,
  MIN_MAP_SIZE,
  MIN_SPEED,
  MUSIC_VOLUME_LOCALSTORAGE_KEY,
  SPEED_LOCALSTORAGE_KEY,
} from '../constants/settings.constants';

export class GameSettings {
  private _speed: number;
  private _mapSize: number;
  private _volume: number;
  private _canGoThroughWalls: boolean;

  private speedRangeInput = document.getElementById('speed-range') as HTMLInputElement;
  private mapSizeRangeInput = document.getElementById('map-size-range') as HTMLInputElement;
  private canGoThroughWallsCheckboxInput = document.getElementById('walls-checkbox') as HTMLInputElement;
  private volumeRangeInput = document.getElementById('music-volume-range') as HTMLInputElement;

  constructor() {
    this._speed = Number(localStorage.getItem(SPEED_LOCALSTORAGE_KEY)) ?? DEFAULT_SPEED;
    this._mapSize = Number(localStorage.getItem(MAP_SIZE_LOCALSTORAGE_KEY)) ?? DEFAULT_MAP_SIZE;
    this._volume = Number(localStorage.getItem(MUSIC_VOLUME_LOCALSTORAGE_KEY)) ?? DEFAULT_VOLUME;
    this._canGoThroughWalls = localStorage.getItem(CAN_GO_THROUGH_WALLS_LOCALSTORAGE_KEY) === 'true' || DEFAULT_CAN_GO_THROUGH_WALLS;
  }

  listenOnInputChanges(onMapResize: () => void, onVolumeChange: () => void): void {
    this.listenOnSpeedChange();
    this.listenOnMapSizeChange(onMapResize);
    this.listenOnCanGoThroughWallsChange();
    this.listenVolumeChange(onVolumeChange);
    this.listenOnRestoreDefaultsButtonClick(onMapResize, onVolumeChange);
  }

  private listenOnSpeedChange(): void {
    this.speedRangeInput.value = this.speed.toString();
    this.speedRangeInput.min = MIN_SPEED.toString();
    this.speedRangeInput.max = MAX_SPEED.toString();

    this.speedRangeInput.addEventListener('change', (e: Event) => {
      this.speed = Number((e.target as HTMLInputElement).value);
    });
  }

  private listenOnMapSizeChange(onMapResize: () => void): void {
    this.mapSizeRangeInput.value = this.mapSize.toString();
    this.mapSizeRangeInput.min = MIN_MAP_SIZE.toString();
    this.mapSizeRangeInput.max = MAX_MAP_SIZE.toString();

    this.mapSizeRangeInput.addEventListener('change', (e: Event) => {
      this.mapSize = Number((e.target as HTMLInputElement).value);
      onMapResize();
    });
  }

  private listenOnCanGoThroughWallsChange(): void {
    this.canGoThroughWallsCheckboxInput.checked = this.canGoThroughWalls;

    this.canGoThroughWallsCheckboxInput.addEventListener('change', (e: Event) => {
      this.canGoThroughWalls = (e.target as HTMLInputElement).checked;
    });
  }

  private listenVolumeChange(onVolumeChange: () => void): void {
    this.volumeRangeInput.value = this.volume.toString();

    this.volumeRangeInput.addEventListener('change', (e: Event) => {
      this.volume = Number((e.target as HTMLInputElement).value);
      onVolumeChange();
    });
  }

  private listenOnRestoreDefaultsButtonClick(onCanvasResize: () => void, onVolumeChange: () => void): void {
    (document.getElementById('restore-defaults-button') as HTMLButtonElement).addEventListener('click', () => {
      this.speed = DEFAULT_SPEED;
      this.mapSize = DEFAULT_MAP_SIZE;
      this.volume = DEFAULT_VOLUME;
      this.canGoThroughWalls = DEFAULT_CAN_GO_THROUGH_WALLS;

      this.speedRangeInput.value = this.speed.toString();
      this.mapSizeRangeInput.value = this.mapSize.toString();
      this.canGoThroughWallsCheckboxInput.checked = this.canGoThroughWalls;

      this.volumeRangeInput.value = this.volume.toString();

      onCanvasResize();
      onVolumeChange();
    });
  }

  set speed(newSpeed: number) {
    this._speed = newSpeed;
    localStorage.setItem(SPEED_LOCALSTORAGE_KEY, this.speed.toString());
  }

  set mapSize(newMapSize: number) {
    this._mapSize = newMapSize;
    localStorage.setItem(MAP_SIZE_LOCALSTORAGE_KEY, this.mapSize.toString());
  }

  set volume(volume: number) {
    this._volume = volume;
    localStorage.setItem(MUSIC_VOLUME_LOCALSTORAGE_KEY, this.volume.toString());
  }

  set canGoThroughWalls(canGoThroughWalls: boolean) {
    this._canGoThroughWalls = canGoThroughWalls;
    localStorage.setItem(CAN_GO_THROUGH_WALLS_LOCALSTORAGE_KEY, this.canGoThroughWalls.toString());
  }

  get speed(): number {
    return this._speed;
  }

  get mapSize(): number {
    return this._mapSize;
  }

  get volume(): number {
    return this._volume;
  }

  get canGoThroughWalls(): boolean {
    return this._canGoThroughWalls;
  }
}
