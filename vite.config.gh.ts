import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages 专用构建配置：
// - base = / （自定义域名 myos.solyoung.top 根路径访问）
// - 跳过妙搭产物重排，产出标准 dist/ 静态文件
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  define: {
    'import.meta.env.MIAODA_CLIENT_BASE_PATH': JSON.stringify(''),
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
