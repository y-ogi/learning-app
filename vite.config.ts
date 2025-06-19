import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 本番ビルド最適化
    rollupOptions: {
      output: {
        manualChunks: {
          // 音声ライブラリを別チャンクに分離
          audio: ['howler'],
          // React関連を別チャンクに分離
          react: ['react', 'react-dom'],
        },
      },
    },
    // ファイルサイズ警告のしきい値を上げる（音声ファイルが大きいため）
    chunkSizeWarningLimit: 1000,
  },
  // PWA対応の設定
  base: './',
  server: {
    // 開発サーバーの設定
    host: true,
    port: 3000,
  },
  preview: {
    // プレビューサーバーの設定
    host: true,
    port: 4173,
  },
})
