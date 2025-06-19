import { useEffect, useState, useCallback } from 'react';
import { simpleAudioManager } from '../utils/SimpleAudioManager';

export const useAudio = () => {
  const [isInitialized, setIsInitialized] = useState(simpleAudioManager.isAudioInitialized());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 音声システムを初期化（iOS Safari対応）
   * ボタンクリックなどのユーザー操作から呼び出す必要がある
   */
  const initializeAudio = useCallback(async () => {
    if (isInitialized || isLoading) {
      console.log('Already initialized or loading, skipping...');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await simpleAudioManager.initialize();
      setIsInitialized(true);
    } catch (err) {
      setError('音声の初期化に失敗しました');
      console.error('Audio initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, isLoading]);

  /**
   * 音声ファイルをプリロード（SimpleAudioManagerでは不要）
   */
  const preloadAudio = useCallback(async () => {
    // SimpleAudioManagerでは事前読み込みしない
    return;
  }, []);

  /**
   * 数字を再生
   */
  const playNumber = useCallback(async (number: number) => {
    if (!isInitialized) {
      console.warn('Audio not initialized. Please initialize first.');
      return;
    }
    await simpleAudioManager.playNumber(number);
  }, [isInitialized]);

  /**
   * 効果音を再生
   */
  const playEffect = useCallback(async (effect: 'correct' | 'incorrect' | 'complete') => {
    if (!isInitialized) {
      console.warn('Audio not initialized. Please initialize first.');
      return;
    }
    await simpleAudioManager.playEffect(effect);
  }, [isInitialized]);

  /**
   * 音量を設定（SimpleAudioManagerでは未実装）
   */
  const setVolume = useCallback((volume: number) => {
    // 未実装
  }, []);

  /**
   * 音声の有効/無効を切り替え（SimpleAudioManagerでは未実装）
   */
  const setSoundEnabled = useCallback((enabled: boolean) => {
    // 未実装
  }, []);

  /**
   * 全ての音声を停止（SimpleAudioManagerでは未実装）
   */
  const stopAll = useCallback(() => {
    // 未実装
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
    getVolume: () => 1.0,
    isSoundEnabled: () => true,
  };
};