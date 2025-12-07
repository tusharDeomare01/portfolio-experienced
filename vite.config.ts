import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
// Remove this if you don't need overlay
import { vitePluginErrorOverlay } from "@hiogawa/vite-plugin-error-overlay";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  assetsInclude: ["**/*.glb"],
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    tailwindcss(),
    mode === "development" ? vitePluginErrorOverlay() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['lightswind'], // Exclude lightswind from optimization since we use local components
  },
  build: {
    chunkSizeWarningLimit: 600,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'animation-vendor': ['framer-motion', 'lenis'],
          'ui-vendor': ['lucide-react'],
          'ai-vendor': ['openai'],
        },
      },
    },
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
}));
