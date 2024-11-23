import { defineConfig } from "vite";

export default defineConfig({
  base: "/2024JavaScriptFinal/",
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
  },
});
