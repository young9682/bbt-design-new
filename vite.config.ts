import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 相对 base：GitLab Pages 项目站点部署在子路径（/<group>/<project>/）下，
  // 默认 '/' 会让静态资源 404；'./' 使资源相对 index.html 解析，任意子路径可达。
  // HashRouter（App.tsx）不受 base 影响，深层路由始终可达。
  base: "./",
  server: {
    port: 5174,
  },
});
