import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
      "/uploads": "http://localhost:5000",
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
