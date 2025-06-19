export class SimpleAudioManager {
  private static instance: SimpleAudioManager;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): SimpleAudioManager {
    if (!SimpleAudioManager.instance) {
      SimpleAudioManager.instance = new SimpleAudioManager();
    }
    return SimpleAudioManager.instance;
  }

  async initialize(): Promise<void> {
    this.isInitialized = true;
    console.log('SimpleAudioManager initialized');
  }

  async playNumber(number: number): Promise<void> {
    const url = `/sounds/numbers/${number}.mp3`;
    this.playSound(url);
  }

  async playEffect(effect: 'correct' | 'incorrect' | 'complete'): Promise<void> {
    const url = `/sounds/effects/${effect}.mp3`;
    this.playSound(url);
  }

  private playSound(url: string): void {
    console.log(`Playing: ${url}`);
    
    // シンプルに新しいAudioを作成して再生
    const audio = new Audio(url);
    
    // 再生を試みる（エラーは無視）
    audio.play().catch(error => {
      console.log(`Could not play ${url}:`, error.message);
    });
  }

  isAudioInitialized(): boolean {
    return this.isInitialized;
  }
}

export const simpleAudioManager = SimpleAudioManager.getInstance();