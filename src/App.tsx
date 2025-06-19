import { useState } from 'react';
import { NumberDisplay } from './components/NumberDisplay/NumberDisplay';
import { CountingGame } from './components/CountingGame/CountingGame';
import { DebugLogger } from './components/DebugLogger';

type GameMode = 'home' | 'numbers' | 'counting';

function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('home');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showDebug, setShowDebug] = useState(true); // デバッグを常に表示

  if (currentMode === 'numbers') {
    return (
      <div className="relative">
        <button
          onClick={() => setCurrentMode('home')}
          className="absolute top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md hover:shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg text-xs"
        >
          {showDebug ? 'Hide' : 'Show'} Debug
        </button>
        <NumberDisplay />
        {showDebug && <DebugLogger />}
      </div>
    );
  }

  if (currentMode === 'counting') {
    return (
      <div className="relative">
        <button
          onClick={() => setCurrentMode('home')}
          className="absolute top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md hover:shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg text-xs"
        >
          {showDebug ? 'Hide' : 'Show'} Debug
        </button>
        <CountingGame difficulty={difficulty} />
        {showDebug && <DebugLogger />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">数字を覚えよう！</h1>
          <p className="text-2xl text-gray-600">3歳児向け数字学習アプリ</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 数字表示モード */}
          <button
            onClick={() => setCurrentMode('numbers')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow
                     border-4 border-transparent hover:border-blue-400"
          >
            <div className="text-6xl mb-4">123</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">すうじをみよう</h2>
            <p className="text-gray-600">1から30までの数字を見て、聞いて覚えよう</p>
          </button>

          {/* カウント練習モード */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-6xl mb-4">🍎</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">かぞえてみよう</h2>
            <p className="text-gray-600 mb-4">絵を見て数を数える練習をしよう</p>
            
            {/* 難易度選択 */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setDifficulty('easy');
                  setCurrentMode('counting');
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                かんたん (1-10)
              </button>
              <button
                onClick={() => {
                  setDifficulty('medium');
                  setCurrentMode('counting');
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                ふつう (11-20)
              </button>
              <button
                onClick={() => {
                  setDifficulty('hard');
                  setCurrentMode('counting');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                むずかしい (21-30)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;