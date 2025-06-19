# Coolifyデプロイメントガイド

## 概要
このドキュメントでは、数字学習PWAアプリをCoolifyにデプロイする手順を説明します。

## 前提条件
- Coolifyサーバーが設定済み
- GitリポジトリへのアクセスrwKwrWK
- ドメイン名（オプション）

## ファイル構成
デプロイに必要なファイル：
```
├── Dockerfile              # Dockerビルド設定
├── nginx.conf              # Nginx設定（PWA最適化）
├── docker-compose.yml      # Docker Compose設定
├── coolify.yml            # Coolify設定
├── .dockerignore          # Docker除外ファイル
└── public/sw.js           # Service Worker（PWA）
```

## Coolifyでのデプロイ手順

### 1. プロジェクトの作成
1. Coolifyダッシュボードにログイン
2. 「New Project」をクリック
3. リポジトリを接続（GitHub/GitLab/etc）

### 2. アプリケーション設定
```yaml
# 基本設定
Name: learning-app
Description: 3歳児向け数字学習PWAアプリ
Framework: Static Site / React
Build Pack: Dockerfile
```

### 3. 環境変数設定
```bash
NODE_ENV=production
PORT=80
```

### 4. ビルド設定
```yaml
# Dockerfile使用
Build Command: docker build -t learning-app .
Start Command: nginx -g "daemon off;"
```

### 5. ドメイン設定
- 独自ドメインを設定（推奨）
- HTTPSを有効化（PWA要件）
- `learning-app.yourdomain.com`

## 本番デプロイ確認項目

### ✅ PWA機能チェック
- [ ] manifest.jsonが正常に読み込まれる
- [ ] Service Workerが登録される
- [ ] オフライン動作（音声ファイル込み）
- [ ] ホーム画面に追加可能

### ✅ 音声機能チェック
- [ ] 数字音声（1-30）が再生される
- [ ] 効果音が正常に動作
- [ ] iOS Safariでの音声再生
- [ ] 音声プリロードが動作

### ✅ パフォーマンス
- [ ] 初回ロード時間 < 3秒
- [ ] 音声ファイルキャッシュ
- [ ] Gzip圧縮
- [ ] 静的ファイルキャッシュ

### ✅ セキュリティ
- [ ] HTTPS接続
- [ ] セキュリティヘッダー
- [ ] CSP設定

## トラブルシューティング

### ビルド失敗時
```bash
# ローカルでのテスト
docker build -t learning-app .
docker run -p 80:80 learning-app

# ログ確認
docker logs <container-id>
```

### 音声再生問題
- iOS Safariではユーザー操作後のみ音声再生可能
- AudioManagerの初期化が必要
- HTTPS必須

### PWA問題
- manifest.jsonのMIMEタイプ確認
- Service Worker登録エラー確認
- キャッシュ戦略の見直し

## 監視とメンテナンス

### ヘルスチェック
アプリは `/health` エンドポイントでヘルスチェックに対応：
```bash
curl -f http://your-domain/health
# 期待レスポンス: "healthy"
```

### ログ監視
```bash
# Coolifyでのログ確認
coolify logs --app learning-app

# エラーログの確認
grep "ERROR" /var/log/nginx/error.log
```

### 更新デプロイ
1. Gitにプッシュ
2. Coolifyが自動でデプロイを検出
3. ゼロダウンタイムデプロイ実行

## パフォーマンス最適化

### キャッシュ戦略
```nginx
# 音声ファイル（長期キャッシュ）
location ~* \.(mp3|wav|ogg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# 静的アセット
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN設定（オプション）
CloudflareやAWS CloudFrontとの連携で高速化可能

## セキュリティ設定

### CSP（Content Security Policy）
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src 'self' data:;";
```

## 費用最適化
```yaml
# リソース制限
resources:
  limits:
    memory: 512M
    cpus: '0.5'
  reservations:
    memory: 256M
    cpus: '0.25'
```

## サポート・連絡先
デプロイに関する質問はプロジェクトのIssueページまで。 