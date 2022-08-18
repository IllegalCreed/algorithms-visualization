import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const srcPath = resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 定义别名，方面ts中import使用绝对路径
  resolve: {
    alias: {
      '@/': `${srcPath}/`
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        // 定义全局样式
        additionalData: `@import "${srcPath}/styles/common.less";`,
        javascriptEnabled: true,
      }
    },
  },
})
