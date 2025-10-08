import {
  CAN_GO_THROUGH_WALLS_LOCALSTORAGE_KEY,
  DEFAULT_CAN_GO_THROUGH_WALLS,
  DEFAULT_GAME_MODE,
  DEFAULT_MAP_SIZE,
  DEFAULT_SPEED,
  DEFAULT_VOLUME,
  GAME_MODE_LOCALSTORAGE_KEY,
  MAP_SIZE_LOCALSTORAGE_KEY,
  MUSIC_VOLUME_LOCALSTORAGE_KEY,
  SPEED_LOCALSTORAGE_KEY,
} from '../constants/settings.constants';
import { GameMode } from '../types/game-mode.type';
import { AudioHandler } from './audio-handler.class';
import { SettingsOverlay } from './overlays/settings.overlay';

export class GameSettings {
  private _speed!: number;
  private _mapSize!: number;
  private _volume!: number;
  private _canGoThroughWalls!: boolean;
  private _gameMode!: GameMode;

  private settingsOverlay: SettingsOverlay;
  private audioHandler: AudioHandler;

  constructor(settingsOverlay: SettingsOverlay, audioHandler: AudioHandler) {
    this.settingsOverlay = settingsOverlay;
    this.audioHandler = audioHandler;

    this.gameMode = (localStorage.getItem(GAME_MODE_LOCALSTORAGE_KEY) as GameMode) ?? DEFAULT_GAME_MODE;
    this.speed = Number(localStorage.getItem(SPEED_LOCALSTORAGE_KEY) ?? DEFAULT_SPEED);
    this.mapSize = Number(localStorage.getItem(MAP_SIZE_LOCALSTORAGE_KEY) ?? DEFAULT_MAP_SIZE);
    this.volume = Number(localStorage.getItem(MUSIC_VOLUME_LOCALSTORAGE_KEY) ?? DEFAULT_VOLUME);
    this.canGoThroughWalls = localStorage.getItem(CAN_GO_THROUGH_WALLS_LOCALSTORAGE_KEY) === 'true' || DEFAULT_CAN_GO_THROUGH_WALLS;

    this.listenOnEvents();
  }

  listenOnEvents(): void {
    this.listenOnGameModeChange();
    this.listenOnSpeedChange();
    this.listenOnMapSizeChange();
    this.listenOnCanGoThroughWallsChange();
    this.listenVolumeChange();
    this.listenOnRestoreDefaultsButtonClick();
  }

  private listenOnGameModeChange(): void {
    this.settingsOverlay.on('gameModeChange', (newGameMode: GameMode) => (this.gameMode = newGameMode));
  }

  private listenOnSpeedChange(): void {
    this.settingsOverlay.on('speedChange', (newSpeed: number) => (this.speed = newSpeed));
  }

  private listenOnMapSizeChange(): void {
    this.settingsOverlay.on('mapSizeChange', (newMapSize: number) => (this.mapSize = newMapSize));
  }

  private listenOnCanGoThroughWallsChange(): void {
    this.settingsOverlay.on('canGoThroughWallsChange', (canGoThroughWalls: boolean) => (this.canGoThroughWalls = canGoThroughWalls));
  }

  private listenVolumeChange(): void {
    this.settingsOverlay.on('volumeChange', (newVolume: number) => (this.volume = newVolume));
  }

  private listenOnRestoreDefaultsButtonClick(): void {
    this.settingsOverlay.on('restoreDefaultsButtonClick', () => {
      this.gameMode = DEFAULT_GAME_MODE;
      this.speed = DEFAULT_SPEED;
      this.mapSize = DEFAULT_MAP_SIZE;
      this.volume = DEFAULT_VOLUME;
      this.canGoThroughWalls = DEFAULT_CAN_GO_THROUGH_WALLS;
    });
  }

  set gameMode(newGameMode: GameMode) {
    this._gameMode = newGameMode;
    localStorage.setItem(GAME_MODE_LOCALSTORAGE_KEY, newGameMode.toString());
    this.settingsOverlay.gameModeSelect.value = newGameMode;
  }

  set speed(newSpeed: number) {
    this._speed = newSpeed;
    localStorage.setItem(SPEED_LOCALSTORAGE_KEY, newSpeed.toString());
    this.settingsOverlay.speedRangeInput.value = newSpeed.toString();
    this.settingsOverlay.speedValueText.innerText = newSpeed.toString();
  }

  set mapSize(newMapSize: number) {
    this._mapSize = newMapSize;
    localStorage.setItem(MAP_SIZE_LOCALSTORAGE_KEY, newMapSize.toString());
    this.settingsOverlay.mapSizeRangeInput.value = newMapSize.toString();
    this.settingsOverlay.mapSizeValueText.innerText = newMapSize.toString();
  }

  set volume(newVolume: number) {
    this._volume = newVolume;
    localStorage.setItem(MUSIC_VOLUME_LOCALSTORAGE_KEY, newVolume.toString());
    this.audioHandler.setAudioVolume(newVolume);
    this.settingsOverlay.volumeRangeInput.value = newVolume.toString();
    this.settingsOverlay.volumeValueText.innerText = Math.floor(newVolume * 100).toString();
  }

  set canGoThroughWalls(canGoThroughWalls: boolean) {
    this._canGoThroughWalls = canGoThroughWalls;
    localStorage.setItem(CAN_GO_THROUGH_WALLS_LOCALSTORAGE_KEY, canGoThroughWalls.toString());
    this.settingsOverlay.canGoThroughWallsCheckboxInput.checked = canGoThroughWalls;
  }

  get gameMode(): GameMode {
    return this._gameMode;
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

  get numberOfPlayers(): number {
    return this.gameMode === 'SINGLE_PLAYER' ? 1 : 2;
  }
}
