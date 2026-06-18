import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 按 mode 加载对应 .env 文件：
  //   production → VITE_BASE_URL=/algorithms-visualization/（GitHub Pages 子路径）
  //   selfhost   → VITE_BASE_URL=/（自有域名 algo.illegalscreed.cn 根路径）
  //   development → /（.env.development）
  Object.assign(process.env, loadEnv(mode, process.cwd()));
  return {
    base: process.env.VITE_BASE_URL || '/',
    plugins: [vue()],
    // 定义别名，方便ts中import使用绝对路径
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('.', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          // 定义全局样式
          additionalData: `@import "${fileURLToPath(
            new URL('./src', import.meta.url),
          )}/styles/common.less";`,
          javascriptEnabled: true,
        },
      },
    },
  };
});
