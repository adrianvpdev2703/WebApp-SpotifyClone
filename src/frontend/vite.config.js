// src/frontend/vite.config.js
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      // Cualquier petición que empiece con /usuarios o /canciones se redirige al backend
      "/usuarios": "http://localhost:3000",
      "/canciones": "http://localhost:3000",
    },
  },
});
