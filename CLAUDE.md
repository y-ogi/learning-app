# CLAUDE.md - プロジェクト情報

## プロジェクト概要
3歳児向けの数字学習PWAアプリケーション。iPadのSafariで動作し、1から30までの数字を英語で学習できる。

## 重要な制約
- 対象デバイス：iPad Safari
- PWA形式（App Store配信なし）
- オフライン対応必須
- 音声は必ずユーザー操作後に再生（iOS制限）

## 開発時の注意点

### コマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# 型チェック
npm run typecheck

# リント
npm run lint
```

### ディレクトリ構造
- `/src/components/` - UIコンポーネント
- `/public/sounds/` - 音声ファイル（1-30の英語音声）
- `/public/icons/` - PWAアイコン
- `/docs/` - 仕様書類

### 技術スタック
- React 18 + TypeScript
- Vite（ビルドツール）
- Tailwind CSS
- Howler.js（音声再生）
- PWA（Service Worker）

### テスト方針
- コンポーネントテスト：Jest + React Testing Library
- E2Eテスト：実機iPad Safariでの動作確認必須

### デバッグ時のポイント
1. 音声再生はユーザー操作が必要
2. PWAはHTTPS環境でのみ動作
3. iPadの画面サイズに最適化（レスポンシブ対応）
4. タッチイベントの最適化が必要

### よくあるエラーと対処
- `Audio play() failed`: ユーザー操作なしで音声再生を試みた
- `Service Worker registration failed`: HTTP環境で実行している
- タッチ反応遅延: touch-action: manipulation を設定する