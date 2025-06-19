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
    
    // Howler.jsのグローバル設定
    Howler.autoUnlock = true;
    Howler.html5PoolSize = 10;
    Howler.usingWebAudio = false; // Web Audio APIを無効化してHTML5 Audioのみ使用
    
    // シンプルに初期化完了とする
    this.isInitialized = true;
    console.log('AudioManager initialized successfully (simplified)');
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
          preload: true, // 事前読み込みを有効化
          onplay: () => {
            console.log(`Successfully started playing: ${url}`);
          },
          onend: () => {
            console.log(`Finished playing: ${url}`);
          },
          onplayerror: (_id, error) => {
            console.error(`Play error for ${url}:`, error);
            // エラー時は通常のHTML5 Audioで再試行
            this.fallbackPlay(url);
          },
          onloaderror: (_id, error) => {
            console.error(`Load error for ${url}:`, error);
            // ロードエラー時もフォールバックを試す
            this.fallbackPlay(url);
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
   * フォールバック: 通常のHTML5 Audioで再生
   */
  private fallbackPlay(url: string): void {
    console.log(`Trying fallback HTML5 Audio for: ${url}`);
    try {
      const audio = new Audio(url);
      audio.volume = this.volume;
      
      // イベントリスナーを追加してデバッグ
      audio.addEventListener('canplay', () => {
        console.log(`Fallback audio can play: ${url}`);
        audio.play()
          .then(() => console.log(`Fallback audio playing: ${url}`))
          .catch(err => console.error(`Fallback audio play failed: ${err}`));
      });
      
      audio.addEventListener('error', (e) => {
        console.error(`Fallback audio error event:`, e);
        console.error(`Audio error code: ${audio.error?.code}, message: ${audio.error?.message}`);
      });
      
      // srcを設定してロード開始
      audio.src = url;
      audio.load();
    } catch (error) {
      console.error(`Fallback audio error: ${error}`);
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