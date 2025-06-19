import { Howl, Howler } from 'howler';

interface AudioCache {
  [key: string]: Howl;
}

export class AudioManager {
  private static instance: AudioManager;
  private audioCache: AudioCache = {};
  private isInitialized = false;
  private volume = 1.0;
  private soundEnabled = true;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /**
   * iOS Safari対応のための初期化
   * ユーザー操作後に呼び出す必要がある
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('Starting AudioManager initialization...');
    
    // iOS Safariのための無音再生で音声コンテキストを開始
    console.log('Creating silent sound Howl instance...');
    const silentSound = new Howl({
      src: ['data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAzA'],
      volume: 0.01,
      html5: true, // iOS Safari対応のためhtml5モードを有効化
      autoplay: false,
      onload: () => {
        console.log('Silent sound loaded successfully');
      },
      onloaderror: (_id, error) => {
        console.error('Silent sound load error:', error);
      }
    });

    try {
      // Howler.jsのグローバル設定
      Howler.autoUnlock = true;
      Howler.html5PoolSize = 10;
      
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.error('Silent sound play timeout after 5 seconds');
          reject(new Error('Audio initialization timeout'));
        }, 5000);

        silentSound.once('play', () => {
          clearTimeout(timeout);
          console.log('Silent sound played successfully');
          resolve();
        });
        
        silentSound.once('playerror', (_id, error) => {
          clearTimeout(timeout);
          console.error('Silent sound play error:', error);
          reject(new Error('Audio initialization failed'));
        });
        
        console.log('Attempting to play silent sound...');
        const playResult = silentSound.play();
        console.log('Silent sound play() called, result:', playResult);
      });
      
      this.isInitialized = true;
      console.log('AudioManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
      throw error;
    }
  }

  /**
   * 音声ファイルのプリロード
   */
  async preloadAudio(url: string): Promise<void> {
    if (this.audioCache[url]) return;

    return new Promise((resolve, reject) => {
      const sound = new Howl({
        src: [url],
        preload: true,
        html5: true, // iOS Safari対応のためhtml5モードを有効化
        format: ['mp3'], // フォーマットを明示的に指定
        onload: () => {
          this.audioCache[url] = sound;
          resolve();
        },
        onloaderror: (_id, error) => {
          console.error(`Failed to load audio: ${url}`, error);
          reject(new Error(`Failed to load audio: ${url}`));
        },
      });
    });
  }

  /**
   * 複数の音声ファイルを一括プリロード
   */
  async preloadMultiple(urls: string[]): Promise<void> {
    const promises = urls.map(url => this.preloadAudio(url));
    await Promise.all(promises);
  }

  /**
   * 1-30の数字音声を全てプリロード
   */
  async preloadNumbers(): Promise<void> {
    const numberUrls = Array.from({ length: 30 }, (_, i) => 
      `/sounds/numbers/${i + 1}.mp3`
    );
    await this.preloadMultiple(numberUrls);
  }

  /**
   * 効果音をプリロード
   */
  async preloadEffects(): Promise<void> {
    const effectUrls = [
      '/sounds/effects/correct.mp3',
      '/sounds/effects/incorrect.mp3',
      '/sounds/effects/complete.mp3',
    ];
    await this.preloadMultiple(effectUrls);
  }

  /**
   * 数字を英語で再生
   */
  async playNumber(number: number): Promise<void> {
    console.log(`playNumber called with: ${number}, soundEnabled: ${this.soundEnabled}, isInitialized: ${this.isInitialized}`);
    
    if (!this.soundEnabled || !this.isInitialized) {
      console.log('Skipping playback - not enabled or not initialized');
      return;
    }
    
    const url = `/sounds/numbers/${number}.mp3`;
    await this.playSound(url);
  }

  /**
   * 効果音を再生
   */
  async playEffect(effect: 'correct' | 'incorrect' | 'complete'): Promise<void> {
    console.log(`playEffect called with: ${effect}, soundEnabled: ${this.soundEnabled}, isInitialized: ${this.isInitialized}`);
    
    if (!this.soundEnabled || !this.isInitialized) {
      console.log('Skipping effect playback - not enabled or not initialized');
      return;
    }
    
    const url = `/sounds/effects/${effect}.mp3`;
    await this.playSound(url);
  }

  /**
   * 音声を再生
   */
  private async playSound(url: string): Promise<void> {
    console.log(`Attempting to play sound: ${url}`);
    
    try {
      // キャッシュから取得または新規作成
      let sound = this.audioCache[url];
      
      if (!sound) {
        console.log(`Creating new Howl instance for: ${url}`);
        sound = new Howl({
          src: [url],
          volume: this.volume,
          html5: true, // iOS Safari対応のためhtml5モードを有効化
          format: ['mp3'], // フォーマットを明示的に指定
          onplay: () => {
            console.log(`Successfully started playing: ${url}`);
          },
          onplayerror: (_id, error) => {
            console.error(`Play error for ${url}:`, error);
          },
          onloaderror: (_id, error) => {
            console.error(`Load error for ${url}:`, error);
          },
        });
        this.audioCache[url] = sound;
      }

      // 既に再生中の場合は停止してから再生
      if (sound.playing()) {
        console.log('Stopping current playback before new play');
        sound.stop();
      }

      sound.volume(this.volume);
      console.log(`Playing sound with volume: ${this.volume}`);
      sound.play();
    } catch (error) {
      console.error(`Failed to play audio: ${url}`, error);
    }
  }

  /**
   * 全ての音声を停止
   */
  stopAll(): void {
    Object.values(this.audioCache).forEach(sound => {
      if (sound.playing()) {
        sound.stop();
      }
    });
  }

  /**
   * 音量を設定 (0.0 - 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.volume);
  }

  /**
   * 音声の有効/無効を切り替え
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  /**
   * 現在の音量を取得
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 音声が有効かどうかを取得
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * 初期化済みかどうかを取得
   */
  isAudioInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * キャッシュをクリア
   */
  clearCache(): void {
    this.stopAll();
    Object.keys(this.audioCache).forEach(key => {
      this.audioCache[key].unload();
      delete this.audioCache[key];
    });
  }
}

// シングルトンインスタンスをエクスポート
export const audioManager = AudioManager.getInstance();