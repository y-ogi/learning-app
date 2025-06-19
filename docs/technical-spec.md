# 数字学習アプリ 技術仕様書

## 1. アーキテクチャ概要

### 1.1 システム構成
```
┌─────────────────┐
│   iPad Safari   │
├─────────────────┤
│   PWA (React)   │
├─────────────────┤
│ Service Worker  │
├─────────────────┤
│ Local Storage   │
└─────────────────┘
```

### 1.2 ディレクトリ構造
```
learning-app/
├── public/
│   ├── manifest.json
│   ├── icons/
│   └── sounds/
│       ├── numbers/
│       │   ├── 1.mp3
│       │   ├── 2.mp3
│       │   └── ...
│       └── effects/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── NumberDisplay/
│   │   ├── CountingGame/
│   │   └── NumberGuess/
│   ├── contexts/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── App.tsx
├── docs/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 2. コンポーネント設計

### 2.1 主要コンポーネント

#### App.tsx
- ルーティング管理
- グローバル状態管理
- PWA初期化

#### NumberDisplay
- Props: `number: number`, `onNext: () => void`, `onPrev: () => void`
- 数字の大画面表示
- タップで音声再生
- 前後移動ボタン

#### CountingGame
- Props: `difficulty: 'easy' | 'medium' | 'hard'`
- オブジェクト表示ロジック
- 正解判定
- スコア管理

#### NumberGuess
- 音声再生制御
- 選択肢生成アルゴリズム
- 結果表示

### 2.2 共通コンポーネント

#### Button
```typescript
interface ButtonProps {
  size: 'small' | 'medium' | 'large';
  variant: 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}
```

#### NumberCard
```typescript
interface NumberCardProps {
  number: number;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'large';
}
```

## 3. 状態管理

### 3.1 Context構造
```typescript
interface AppState {
  currentMode: 'display' | 'counting' | 'guess';
  volume: number;
  soundEnabled: boolean;
  progress: {
    displayMode: number[];
    countingGame: GameScore[];
    guessGame: GameScore[];
  };
}

interface GameScore {
  date: string;
  score: number;
  difficulty: string;
}
```

### 3.2 Local Storage
```typescript
interface StorageData {
  settings: {
    volume: number;
    soundEnabled: boolean;
  };
  progress: AppState['progress'];
  lastPlayed: string;
}
```

## 4. PWA実装

### 4.1 Service Worker
```javascript
// キャッシュ戦略
const CACHE_NAME = 'number-learning-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/sounds/numbers/',
  '/sounds/effects/',
];
```

### 4.2 Manifest.json
```json
{
  "name": "数字を覚えよう！",
  "short_name": "数字学習",
  "description": "1から30まで英語で数字を学ぼう",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#4F46E5",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 5. 音声処理

### 5.1 音声ファイル仕様
- フォーマット：MP3
- サンプリングレート：44.1kHz
- ビットレート：128kbps
- 長さ：各1秒以内

### 5.2 音声再生実装
```typescript
class AudioManager {
  private audioCache: Map<string, HTMLAudioElement>;
  
  async playNumber(number: number): Promise<void> {
    const audio = await this.getAudio(`/sounds/numbers/${number}.mp3`);
    audio.volume = this.volume;
    await audio.play();
  }
  
  async playEffect(effect: 'correct' | 'incorrect' | 'complete'): Promise<void> {
    const audio = await this.getAudio(`/sounds/effects/${effect}.mp3`);
    await audio.play();
  }
}
```

## 6. レスポンシブ対応

### 6.1 ブレークポイント
```css
/* Tailwind CSS設定 */
screens: {
  'sm': '640px',   // 縦向きiPad Mini
  'md': '768px',   // 横向きiPad Mini
  'lg': '1024px',  // 縦向きiPad
  'xl': '1280px',  // 横向きiPad
}
```

### 6.2 タッチ最適化
```typescript
// タッチイベント処理
const handleTouch = (e: TouchEvent) => {
  e.preventDefault(); // ダブルタップズーム防止
  // 処理実装
};

// CSS設定
.touch-target {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
}
```

## 7. パフォーマンス最適化

### 7.1 画像最適化
- WebP形式使用
- 適切なサイズでの事前生成
- lazy loading実装

### 7.2 コード分割
```typescript
// React.lazy使用
const CountingGame = lazy(() => import('./components/CountingGame'));
const NumberGuess = lazy(() => import('./components/NumberGuess'));
```

## 8. テスト戦略

### 8.1 単体テスト
- Jest + React Testing Library
- カバレッジ目標：80%以上

### 8.2 E2Eテスト
- Playwright使用
- iPadサイズでのテスト必須

## 9. デプロイ

### 9.1 ビルド設定
```bash
npm run build
# 出力: dist/
```

### 9.2 ホスティング
- 推奨：Vercel/Netlify（自動HTTPS）
- CDN配信推奨