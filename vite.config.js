import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ── Dev proxy (not used in production build) ──────────────
  server: {
    proxy: {
      "/prayer": {
        target: "https://islamicapi.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ── Production build optimizations ────────────────────────
  build: {
    // Use esbuild for fast minification (default), but explicitly set for clarity
    minify: "esbuild",

    // Split CSS into separate file so it can be cached independently
    cssCodeSplit: true,

    // Raise chunk warning limit slightly (GSAP is large)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunk splitting — vendor libs get their own cached chunks
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-gsap": ["gsap", "@gsap/react"],
          "vendor-icons": ["react-icons"],
        },
        // Content-hashed filenames for optimal long-term caching
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});

