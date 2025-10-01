import { loadAudio } from '../utils/load-assets.utils';

export class AudioHandler {
  backgroundMusic!: HTMLAudioElement;
  gameOverSound!: HTMLAudioElement;

  async preloadAudio(): Promise<void> {
    this.backgroundMusic = await loadAudio('/background-music.mp3');
    this.gameOverSound = await loadAudio('/game-over-sound.mp3');

    this.backgroundMusic.loop = true;
  }

  setAudioVolume(volume: number) {
    this.backgroundMusic.volume = volume;
    this.gameOverSound.volume = volume;
  }

  onGameInit() {
    this.backgroundMusic.currentTime = 0;
    this.backgroundMusic.play();
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.pause();
  }

  onGameEnd() {
    this.backgroundMusic.pause();
    this.gameOverSound.play();
  }
}
