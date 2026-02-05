import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/prayer": {
        target: "https://islamicapi.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
