import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],

  // ✅ чтобы работали импорты вида "@/..."
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "https://crm-kukcha.vercel.app",
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/dummy/, ""),
      },

      // 🔥 Лиды сюда
      // "/api": {
      // target: "http://localhost:5000", // или URL бэка
      // changeOrigin: true,
      // secure: false,
      // },
    },
  },
});
