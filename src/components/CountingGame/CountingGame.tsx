import React, { useState, useEffect } from 'react';
import { NumberCard } from '../common/NumberCard';
import { useAudio } from '../../hooks/useAudio';

interface CountingGameProps {
  difficulty?: 'easy' | 'medium' | 'hard';
}

const difficultyRanges = {
  easy: { min: 1, max: 10 },
  medium: { min: 11, max: 20 },
  hard: { min: 21, max: 30 },
};

const emojis = ['🍎', '🍊', '🍇', '🍓', '🍌', '🐶', '🐱', '🐭', '🐹', '🐰'];

export const CountingGame: React.FC<CountingGameProps> = ({ difficulty = 'easy' }) => {
  const [targetNumber, setTargetNumber] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('🍎');

  const {
    isInitialized,
    initializeAudio,
    preloadAudio,
    playNumber,
    playEffect,
  } = useAudio();

  // 新しい問題を生成
  const generateNewProblem = () => {
    const range = difficultyRanges[difficulty];
    const target = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    setTargetNumber(target);
    
    // ランダムな絵文字を選択
    setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    
    // 選択肢を生成（正解を含む3つの選択肢）
    const correctIndex = Math.floor(Math.random() * 3);
    const newOptions: number[] = [];
    
    for (let i = 0; i < 3; i++) {
      if (i === correctIndex) {
        newOptions.push(target);
      } else {
        let wrong;
        do {
          wrong = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        } while (wrong === target || newOptions.includes(wrong));
        newOptions.push(wrong);
      }
    }
    
    setOptions(newOptions);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // 初回実行時に問題を生成
  useEffect(() => {
    generateNewProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // 音声の初期化
  useEffect(() => {
    if (isInitialized) {
      preloadAudio();
    }
  }, [isInitialized, preloadAudio]);

  const handleAnswerSelect = async (answer: number) => {
    console.log('Starting handleAnswerSelect with answer:', answer);
    
    try {
      // 音声処理を完全にスキップして状態更新のみ実行
      console.log('Setting selected answer and show result');
      setSelectedAnswer(answer);
      setShowResult(true);
      setAttempts(attempts + 1);
      
      if (answer === targetNumber) {
        console.log('Correct answer detected');
        setScore(score + 1);
        
        // 2秒後に次の問題へ
        setTimeout(() => {
          console.log('Generating new problem after correct answer');
          generateNewProblem();
        }, 2000);
      } else {
        console.log('Incorrect answer detected');
      }
      
      console.log('handleAnswerSelect completed successfully');
    } catch (error) {
      console.error('Error in handleAnswerSelect:', error);
    }
  };

  const renderObjects = () => {
    const items = [];
    
    for (let i = 0; i < targetNumber; i++) {
      items.push(
        <span 
          key={i} 
          className="text-4xl animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {currentEmoji}
        </span>
      );
    }
    
    return (
      <div className="grid grid-cols-5 gap-2 justify-center">
        {items}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">かぞえてみよう！</h2>
        <div className="text-lg font-semibold">
          スコア: {score}/{attempts}
        </div>
      </div>

      {/* 難易度表示 */}
      <div className="text-center mb-4">
        <span className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium">
          {difficulty === 'easy' ? 'かんたん (1-10)' : 
           difficulty === 'medium' ? 'ふつう (11-20)' : 
           'むずかしい (21-30)'}
        </span>
      </div>

      {/* オブジェクト表示エリア */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 min-h-[300px] flex items-center justify-center">
        {renderObjects()}
      </div>

      {/* 質問 */}
      <div className="text-center mb-6">
        <p className="text-2xl font-bold text-gray-800">
          {currentEmoji}はいくつありますか？
        </p>
      </div>

      {/* 選択肢 */}
      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <div key={option} className="relative">
            <NumberCard
              number={option}
              size="medium"
              isSelected={selectedAnswer === option}
              onClick={() => !showResult && handleAnswerSelect(option)}
            />
            {showResult && option === targetNumber && (
              <div className="absolute -top-2 -right-2 pointer-events-none">
                <span className="text-2xl">✅</span>
              </div>
            )}
            {showResult && selectedAnswer === option && option !== targetNumber && (
              <div className="absolute -top-2 -right-2 pointer-events-none">
                <span className="text-2xl">❌</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 結果メッセージ */}
      {showResult && (
        <div className="text-center mt-6">
          {selectedAnswer === targetNumber ? (
            <p className="text-2xl font-bold text-green-600">
              せいかい！ 🎉
            </p>
          ) : (
            <div>
              <p className="text-xl font-bold text-red-600">
                ざんねん... もういちど！
              </p>
              <button
                onClick={() => {
                  setShowResult(false);
                  setSelectedAnswer(null);
                }}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                もういちど
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};