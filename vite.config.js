import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath } from "node:url"; // 配置路径

const __dirname = fileURLToPath(new URL(".", import.meta.url));
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 9527, // 配置端口
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 配置路径
    },
  },
  // msw
  optimizeDeps: {
    include: ["msw/browser"],
  },
  // msw
  build: {
    outDir: "docs",
    assetsDir: "assets",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // 调整块大小警告限制(kB)
  },
});
