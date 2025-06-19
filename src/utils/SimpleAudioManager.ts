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
    await this.playSound(url);
  }

  async playEffect(effect: 'correct' | 'incorrect' | 'complete'): Promise<void> {
    const url = `/sounds/effects/${effect}.mp3`;
    await this.playSound(url);
  }

  private async playSound(url: string): Promise<void> {
    try {
      // 毎回新しいAudioインスタンスを作成（キャッシュ問題を回避）
      const audio = new Audio(url);
      audio.volume = 1.0;
      
      // 再生を試みる
      await audio.play();
      console.log(`Playing: ${url}`);
    } catch (error) {
      console.error(`Failed to play: ${url}`, error);
    }
  }

  isAudioInitialized(): boolean {
    return this.isInitialized;
  }
}

export const simpleAudioManager = SimpleAudioManager.getInstance();