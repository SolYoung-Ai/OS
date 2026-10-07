import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages 专用构建配置：
// - base = /OS/ （项目站子路径，仓库已改名 SolYoung-Ai/OS）
// - 跳过妙搭产物重排，产出标准 dist/ 静态文件
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/OS/',
  define: {
    'import.meta.env.MIAODA_CLIENT_BASE_PATH': JSON.stringify('/OS/'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
