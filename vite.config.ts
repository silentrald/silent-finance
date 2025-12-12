/// <reference types="vitest" />

import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ vue(), legacy() ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8000,
  },
  // test: {
  //   globals: true,
  //   environment: "jsdom",
  // },
});
