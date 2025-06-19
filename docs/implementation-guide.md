# 数字学習アプリ 実装ガイド

## 1. 開発環境セットアップ

### 1.1 必要なツール
- Node.js 18.x以上
- npm または yarn
- Git
- VS Code（推奨エディタ）

### 1.2 プロジェクト初期化
```bash
# プロジェクト作成
npm create vite@latest . -- --template react-ts

# 依存関係インストール
npm install

# 追加パッケージ
npm install -D tailwindcss postcss autoprefixer
npm install workbox-webpack-plugin
npm install howler
```

## 2. 基本実装手順

### 2.1 Phase 1: 基礎構築（1-2日）
1. プロジェクトセットアップ
2. Tailwind CSS設定
3. 基本的なルーティング実装
4. PWA基本設定

### 2.2 Phase 2: UI実装（2-3日）
1. 共通コンポーネント作成
2. ホーム画面実装
3. 数字表示モード実装
4. レスポンシブ対応

### 2.3 Phase 3: 音声機能（1-2日）
1. 音声ファイル準備
2. AudioManager実装
3. 音声再生統合

### 2.4 Phase 4: ゲーム機能（3-4日）
1. カウントゲーム実装
2. 数字当てゲーム実装
3. スコア管理機能

### 2.5 Phase 5: 仕上げ（1-2日）
1. PWA最適化
2. パフォーマンス調整
3. バグ修正

## 3. コード例

### 3.1 数字コンポーネント
```tsx
// components/NumberDisplay/NumberDisplay.tsx
import React from 'react';
import { useAudio } from '../../hooks/useAudio';

interface NumberDisplayProps {
  number: number;
  onNext: () => void;
  onPrev: () => void;
}

export const NumberDisplay: React.FC<NumberDisplayProps> = ({
  number,
  onNext,
  onPrev,
}) => {
  const { playNumber } = useAudio();
  
  const handleNumberClick = async () => {
    await playNumber(number);
  };
  
  const numberWords = [
    '', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
    'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
    'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five',
    'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty'
  ];
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleNumberClick}
        className="text-9xl font-bold text-blue-600 p-16 rounded-3xl
                   bg-yellow-100 shadow-lg transform transition-all
                   active:scale-95 select-none"
      >
        {number}
      </button>
      <p className="text-4xl mt-8 text-gray-700">{numberWords[number]}</p>
      
      <div className="flex gap-8 mt-16">
        <button
          onClick={onPrev}
          disabled={number === 1}
          className="px-8 py-4 text-2xl bg-gray-200 rounded-xl
                     disabled:opacity-50 active:scale-95"
        >
          ◀︎
        </button>
        <button
          onClick={onNext}
          disabled={number === 30}
          className="px-8 py-4 text-2xl bg-gray-200 rounded-xl
                     disabled:opacity-50 active:scale-95"
        >
          ▶︎
        </button>
      </div>
    </div>
  );
};
```

### 3.2 音声管理Hook
```tsx
// hooks/useAudio.ts
import { useCallback, useContext } from 'react';
import { Howl } from 'howler';
import { SettingsContext } from '../contexts/SettingsContext';

export const useAudio = () => {
  const { volume, soundEnabled } = useContext(SettingsContext);
  
  const playNumber = useCallback(async (number: number) => {
    if (!soundEnabled) return;
    
    const sound = new Howl({
      src: [`/sounds/numbers/${number}.mp3`],
      volume: volume / 100,
    });
    
    sound.play();
  }, [volume, soundEnabled]);
  
  const playEffect = useCallback(async (effect: string) => {
    if (!soundEnabled) return;
    
    const sound = new Howl({
      src: [`/sounds/effects/${effect}.mp3`],
      volume: volume / 100,
    });
    
    sound.play();
  }, [volume, soundEnabled]);
  
  return { playNumber, playEffect };
};
```

### 3.3 Service Worker
```js
// public/sw.js
const CACHE_NAME = 'number-learning-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// 音声ファイルを動的にキャッシュリストに追加
for (let i = 1; i <= 30; i++) {
  urlsToCache.push(`/sounds/numbers/${i}.mp3`);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

## 4. テスト実装

### 4.1 コンポーネントテスト
```tsx
// __tests__/NumberDisplay.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberDisplay } from '../components/NumberDisplay';

describe('NumberDisplay', () => {
  it('displays the correct number', () => {
    render(<NumberDisplay number={15} onNext={jest.fn()} onPrev={jest.fn()} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('fifteen')).toBeInTheDocument();
  });
  
  it('plays sound when number is clicked', async () => {
    const mockPlayNumber = jest.fn();
    jest.mock('../hooks/useAudio', () => ({
      useAudio: () => ({ playNumber: mockPlayNumber })
    }));
    
    render(<NumberDisplay number={5} onNext={jest.fn()} onPrev={jest.fn()} />);
    fireEvent.click(screen.getByText('5'));
    
    expect(mockPlayNumber).toHaveBeenCalledWith(5);
  });
});
```

## 5. デバッグとトラブルシューティング

### 5.1 よくある問題と対処法

#### 音声が再生されない
- iOS Safariは自動再生制限があるため、必ずユーザー操作後に再生
- 音声ファイルのプリロードを実装

#### PWAがインストールできない
- HTTPSでホスティングされているか確認
- manifest.jsonが正しく配信されているか確認
- Service Workerが正しく登録されているか確認

#### タッチ反応が悪い
- touch-action: manipulation を設定
- 300msの遅延を防ぐ

### 5.2 パフォーマンス最適化
```tsx
// 画像の遅延読み込み
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-contain"
    />
  );
};

// コンポーネントの遅延読み込み
const CountingGame = lazy(() => import('./components/CountingGame'));
```

## 6. デプロイ準備

### 6.1 ビルド最適化
```js
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'game': ['./src/components/CountingGame', './src/components/NumberGuess'],
        },
      },
    },
  },
};
```

### 6.2 デプロイチェックリスト
- [ ] 全音声ファイルが含まれているか
- [ ] PWA設定が正しいか
- [ ] HTTPSでアクセス可能か
- [ ] iPadでの動作確認
- [ ] オフライン動作確認