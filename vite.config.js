import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],

  // ✅ 新增：开发环境代理，用于连接 WordPress / Woo / CoCart
  server: {
    proxy: {
      // 中文注释：代理所有 /wp-json 请求到 estora.au，解决 CORS
      '/wp-json': {
        target: 'https://estora.au',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
