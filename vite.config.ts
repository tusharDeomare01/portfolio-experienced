import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
// Remove this if you don't need overlay
import { vitePluginErrorOverlay } from "@hiogawa/vite-plugin-error-overlay";
import { seoPlugin } from "./vite-plugin-seo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get base URL from environment or use default
const getBaseUrl = () => {
  if (process.env.VITE_BASE_URL) {
    return process.env.VITE_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NETLIFY) {
    return process.env.URL || `https://${process.env.DEPLOY_PRIME_URL}`;
  }
  return 'https://tushar-deomare-portfolio.vercel.app/';
};

export default defineConfig(({ mode }) => ({
  assetsInclude: ["**/*.glb"],
  server: {
    host: "::",
    port: 8080,
    // Enable file system caching for faster dev server
    fs: {
      strict: false,
    },
  },
  // Worker configuration for parallel processing
  worker: {
    format: 'es',
    plugins: () => [react()],
  },
  plugins: [
    react(),
    tailwindcss(),
    mode === "development" ? vitePluginErrorOverlay() : null,
    seoPlugin({
      baseUrl: getBaseUrl(),
      routes: [
        { path: '/', priority: 1.0, changefreq: 'weekly' },
        { path: '/marketjd', priority: 0.8, changefreq: 'monthly' },
        { path: '/portfolio', priority: 0.8, changefreq: 'monthly' }
      ]
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['lightswind'], // Exclude lightswind from optimization since we use local components
    // Enable parallel optimization with worker threads
    esbuildOptions: {
      // Use all available CPU cores for faster builds
      logLevel: 'info',
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    minify: 'esbuild', // Fast minification with parallel processing
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    // Enable parallel processing for terser/esbuild
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Maximize parallel processing
      maxParallelFileOps: 16, // Matches UV_THREADPOOL_SIZE
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'animation-vendor': ['framer-motion'],
          'ui-vendor': ['lucide-react'],
          'ai-vendor': ['openai'],
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[ext]/[name]-[hash][extname]`;
        },
      },
    },
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Production optimizations
    cssCodeSplit: true, // Split CSS into separate files
    reportCompressedSize: true, // Report compressed sizes
    target: 'esnext', // Target modern browsers for smaller output
    // Enable watch mode optimization
    watch: mode === 'development' ? {
      buildDelay: 100,
    } : null,
  },
  // Enable esbuild for faster transpilation
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    legalComments: 'none',
    treeShaking: true,
  },
}));
