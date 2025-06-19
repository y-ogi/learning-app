import { useEffect, useState, useCallback } from 'react';
import { audioManager } from '../utils/AudioManager';

export const useAudio = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 音声システムを初期化（iOS Safari対応）
   * ボタンクリックなどのユーザー操作から呼び出す必要がある
   */
  const initializeAudio = useCallback(async () => {
    if (isInitialized) return;

    try {
      setIsLoading(true);
      setError(null);
      await audioManager.initialize();
      setIsInitialized(true);
    } catch (err) {
      setError('音声の初期化に失敗しました');
      console.error('Audio initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  /**
   * 音声ファイルをプリロード
   */
  const preloadAudio = useCallback(async () => {
    if (!isInitialized) return;

    try {
      setIsLoading(true);
      await Promise.all([
        audioManager.preloadNumbers(),
        audioManager.preloadEffects(),
      ]);
    } catch (err) {
      console.error('Audio preload error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  /**
   * 数字を再生
   */
  const playNumber = useCallback(async (number: number) => {
    if (!isInitialized) {
      console.warn('Audio not initialized. Please initialize first.');
      return;
    }
    await audioManager.playNumber(number);
  }, [isInitialized]);

  /**
   * 効果音を再生
   */
  const playEffect = useCallback(async (effect: 'correct' | 'incorrect' | 'complete') => {
    if (!isInitialized) {
      console.warn('Audio not initialized. Please initialize first.');
      return;
    }
    await audioManager.playEffect(effect);
  }, [isInitialized]);

  /**
   * 音量を設定
   */
  const setVolume = useCallback((volume: number) => {
    audioManager.setVolume(volume);
  }, []);

  /**
   * 音声の有効/無効を切り替え
   */
  const setSoundEnabled = useCallback((enabled: boolean) => {
    audioManager.setSoundEnabled(enabled);
  }, []);

  /**
   * 全ての音声を停止
   */
  const stopAll = useCallback(() => {
    audioManager.stopAll();
  }, []);

  // クリーンアップ
  useEffect(() => {
    return () => {
      audioManager.stopAll();
    };
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    initializeAudio,
    preloadAudio,
    playNumber,
    playEffect,
    setVolume,
    setSoundEnabled,
    stopAll,
    getVolume: audioManager.getVolume.bind(audioManager),
    isSoundEnabled: audioManager.isSoundEnabled.bind(audioManager),
  };
};