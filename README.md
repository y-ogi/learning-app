# 数字学習アプリ - Learning Numbers 1-30

3歳児向けの数字学習PWAアプリケーション。1から30までの数字を英語で楽しく学べます。

## 特徴

- 🔢 1〜30の数字を大きく表示
- 🔊 タップで英語音声読み上げ
- 🎮 楽しいゲームモード
- 📱 iPad最適化
- 🌐 オフライン対応（PWA）
- 👶 3歳児でも使いやすいシンプルUI

## 機能

### 数字表示モード
- 大きな数字表示
- タップで英語発音（one, two, three...）
- 前後の数字へ簡単移動

### カウント練習ゲーム
- かわいい動物や果物を数える
- 難易度別（1-10、11-20、21-30）
- 正解時の楽しいアニメーション

### 数字当てゲーム
- 音声を聞いて正しい数字を選ぶ
- 3つの選択肢から選択
- 連続正解でレベルアップ

## インストール方法

### 開発環境

```bash
# リポジトリをクローン
git clone [repository-url]
cd learning-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### iPadでの使用方法

1. アプリをデプロイしたURLにSafariでアクセス
2. 共有ボタンをタップ
3. 「ホーム画面に追加」を選択
4. アプリ名を確認して「追加」

## 技術スタック

- **フロントエンド**: React + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **音声処理**: Howler.js
- **PWA**: Service Worker + Web App Manifest

## 開発

### 必要な環境
- Node.js 18.x以上
- npm または yarn

### コマンド

```bash
# 開発サーバー
npm run dev

# ビルド
npm run build

# ビルドプレビュー
npm run preview

# 型チェック
npm run typecheck

# リント
npm run lint
```

### プロジェクト構造

```
learning-app/
├── public/          # 静的ファイル
│   ├── sounds/      # 音声ファイル
│   └── icons/       # PWAアイコン
├── src/
│   ├── components/  # Reactコンポーネント
│   ├── contexts/    # Context API
│   ├── hooks/       # カスタムフック
│   └── utils/       # ユーティリティ
└── docs/           # ドキュメント
```

## ドキュメント

詳細なドキュメントは `/docs` ディレクトリを参照してください：

- [要件定義書](docs/requirements.md)
- [技術仕様書](docs/technical-spec.md)
- [UIデザイン仕様](docs/ui-design.md)
- [実装ガイド](docs/implementation-guide.md)

## ライセンス

[ライセンスを選択してください]

## 貢献

プルリクエストは歓迎します。大きな変更の場合は、まずissueを作成して変更内容を議論してください。

## サポート

問題や質問がある場合は、GitHubのissueを作成してください。