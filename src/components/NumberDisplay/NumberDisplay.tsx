import React, { useState, useEffect } from 'react';
import { NumberCard } from '../common/NumberCard';
import { useAudio } from '../../hooks/useAudio';

interface NumberDisplayProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export const NumberDisplay: React.FC<NumberDisplayProps> = () => {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    isInitialized: audioInitialized,
    initializeAudio,
    preloadAudio,
    playNumber,
    playEffect,
    isSoundEnabled,
    setSoundEnabled,
  } = useAudio();

  // 音声の初期化とプリロード
  useEffect(() => {
    if (audioInitialized && !isInitialized) {
      preloadAudio();
      setIsInitialized(true);
    }
  }, [audioInitialized, isInitialized, preloadAudio]);

  const handleNumberClick = async () => {
    if (!audioInitialized) {
      // 最初のタップで音声を初期化
      await initializeAudio();
      await preloadAudio();
      setIsInitialized(true);
    }
    
    // 数字の音声を再生
    await playNumber(currentNumber);
  };

  const handleNext = () => {
    if (currentNumber < 30) {
      setCurrentNumber(currentNumber + 1);
      playEffect('correct');
    }
  };

  const handlePrev = () => {
    if (currentNumber > 1) {
      setCurrentNumber(currentNumber - 1);
      playEffect('correct');
    }
  };

  const handleRandom = () => {
    const newNumber = Math.floor(Math.random() * 30) + 1;
    setCurrentNumber(newNumber);
    playEffect('complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">数字を覚えよう！</h1>
        
        {/* 音声ON/OFFボタン */}
        <button
          onClick={() => setSoundEnabled(!isSoundEnabled())}
          className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          aria-label={isSoundEnabled() ? "音声をオフにする" : "音声をオンにする"}
        >
          {isSoundEnabled() ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>

      {/* メイン数字表示 */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="mb-8">
          <div 
            onClick={handleNumberClick}
            className="cursor-pointer transform transition-transform hover:scale-105"
          >
            <NumberCard
              number={currentNumber}
              size="large"
              showText={true}
              isSelected={true}
            />
          </div>
          {!audioInitialized && (
            <p className="text-center text-sm text-gray-600 mt-4">
              タップして音声を有効にする
            </p>
          )}
        </div>

        {/* コントロールボタン */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handlePrev}
            disabled={currentNumber === 1}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-blue-600 active:scale-95 transition-all"
          >
            前へ
          </button>
          
          <button
            onClick={handleRandom}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-bold 
                     hover:bg-purple-600 active:scale-95 transition-all"
          >
            ランダム
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentNumber === 30}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-blue-600 active:scale-95 transition-all"
          >
            次へ
          </button>
        </div>

        {/* 数字一覧 */}
        <div className="grid grid-cols-6 gap-2 max-w-md">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
            <div
              key={num}
              onClick={() => {
                setCurrentNumber(num);
                playNumber(num);
              }}
              className="cursor-pointer"
            >
              <NumberCard
                number={num}
                size="small"
                isSelected={num === currentNumber}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};