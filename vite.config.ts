import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

Object.assign(
  process.env,
  loadEnv(process.env.NODE_ENV as string, process.cwd())
);
// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  plugins: [vue()],
  // 定义别名，方面ts中import使用绝对路径
  resolve: {
    alias: {
      "~": fileURLToPath(new URL(".", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 定义全局样式
        additionalData: `@import "${fileURLToPath(
          new URL("./src", import.meta.url)
        )}/styles/common.less";`,
        javascriptEnabled: true,
      },
    },
  },
});
