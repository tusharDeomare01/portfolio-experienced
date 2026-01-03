import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
// Remove this if you don't need overlay
import { vitePluginErrorOverlay } from "@hiogawa/vite-plugin-error-overlay";
import { seoPlugin } from "./vite-plugin-seo";
// import { varBindingsPlugin } from "./vite-plugin-var-bindings"; // Disabled - causing runtime issues
import babel from "vite-plugin-babel";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get base URL from environment or use default
const getBaseUrl = () => {
  let url: string;
  if (process.env.VITE_BASE_URL) {
    url = process.env.VITE_BASE_URL;
  } else if (process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`;
  } else if (process.env.NETLIFY) {
    url = process.env.URL || `https://${process.env.DEPLOY_PRIME_URL}`;
  } else {
    url = "https://tushar-deomare-portfolio.vercel.app";
  }
  // Remove trailing slash to prevent double slashes
  return url.replace(/\/+$/, '');
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
    format: "es",
    plugins: () => [react()],
  },
  plugins: [
    react(),
    babel({
      babelConfig: {
        presets: [
          [
            "@babel/preset-react",
            {
              runtime: "automatic", // Use automatic JSX runtime (no need to import React)
            },
          ],
          "@babel/preset-typescript",
        ],
        plugins: ["babel-plugin-react-compiler"],
      },
      // Exclude node_modules from Babel processing to avoid warnings and improve performance
      // Only process source files in src/ directory - React Compiler doesn't need to process vendor code
      filter: (id) => {
        // Only process files in src/ directory, exclude all node_modules
        return (
          /\.(jsx?|tsx?)$/.test(id) &&
          !id.includes("node_modules") &&
          (id.includes("/src/") || id.includes("\\src\\"))
        );
      },
    }),
    tailwindcss(),
    mode === "development" ? vitePluginErrorOverlay() : null,
    seoPlugin({
      baseUrl: getBaseUrl(),
      routes: [
        { path: "/", priority: 1.0, changefreq: "weekly" },
        { path: "/marketjd", priority: 0.8, changefreq: "monthly" },
        { path: "/portfolio", priority: 0.8, changefreq: "monthly" },
      ],
    }),
    // DISABLED: varBindingsPlugin causing runtime issues
    // Keeping minification enabled without this plugin
    // mode === 'production' ? varBindingsPlugin() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["lightswind"], // Exclude lightswind from optimization since we use local components
    // Enable parallel optimization with worker threads
    esbuildOptions: {
      // Use all available CPU cores for faster builds
      logLevel: "info",
    },
    // Ensure proper dependency resolution
    include: [
      "react",
      "react-dom",
      "react-redux",
      "@reduxjs/toolkit",
      "redux-persist",
      "reselect",
    ],
  },
  build: {
    chunkSizeWarningLimit: 600,
    // Minification enabled with esbuild (faster and safer than terser)
    minify: mode === "production" ? "esbuild" : false,
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    // Note: terserOptions only apply when minify: 'terser', we're using esbuild instead
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
      // ROOT CAUSE FIX: Properly handle CommonJS modules to avoid TDZ issues
      strictRequires: false, // Don't use strict requires which can cause initialization order issues
      esmExternals: true,
      // Ensure proper transformation order
      requireReturnsDefault: "auto",
      // Prevent hoisting issues
      defaultIsModuleExports: "auto",
    },
    rollupOptions: {
      // Maximize parallel processing
      maxParallelFileOps: 16, // Matches UV_THREADPOOL_SIZE
      // Ensure proper handling of circular dependencies
      treeshake: {
        moduleSideEffects: (id) => {
          // More aggressive tree-shaking: only preserve side effects for known problematic packages
          if (id.includes("node_modules")) {
            // Only preserve side effects for packages that actually need them
            return (
              id.includes("framer-motion") ||
              id.includes("three") ||
              id.includes("@react-three") ||
              id.includes("@tsparticles") ||
              id.includes("lightswind")
            );
          }
          return false; // Tree-shake everything else aggressively
        },
        // More aggressive tree shaking to reduce bundle size
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
      output: {
        // Ensure proper chunk loading order
        experimentalMinChunkSize: 30000, // Increased for better chunk optimization
        // Ensure proper module format to handle circular dependencies
        format: "es",
        // ROOT CAUSE FIX: Prevent TDZ violations in generated code
        // The issue is that Rollup creates const/let bindings that can cause TDZ errors
        // when modules have circular dependencies or initialization order issues
        generatedCode: {
          constBindings: false, // CRITICAL: Use var instead of const to avoid TDZ issues
          // var is hoisted and doesn't have TDZ, so it's safe even with circular deps
          objectShorthand: true,
          reservedNamesAsProps: true,
          // Ensure proper code generation that maintains initialization order
          arrowFunctions: true,
        },
        // CRITICAL: Ensure proper module initialization order
        // This ensures that chunks are loaded and initialized in dependency order
        // three-vendor must initialize completely before vendor chunk uses its exports
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        // Ensure proper interop for default exports to prevent initialization issues
        interop: "compat", // Use compatibility interop to handle module initialization better
        manualChunks: (id) => {
          // More granular chunking for better caching and to avoid circular dependencies
          if (id.includes("node_modules")) {
            // CRITICAL: Three.js MUST be first and isolated to avoid TDZ issues
            // Three.js has internal circular dependencies and uses const/let in source code
            // Isolating it ensures it initializes before any code that depends on it
            // Also include packages that extend Three.js classes (like gainmap-js)
            if (
              id.includes("three") ||
              id.includes("meshline") ||
              id.includes("ogl") ||
              id.includes("gainmap") ||
              id.includes("@monogrid")
            ) {
              return "three-vendor";
            }
            // React core - must load early but after Three.js
            if (
              id.includes("react/") ||
              id.includes("react-dom/") ||
              id.includes("scheduler/")
            ) {
              return "react-core";
            }
            // React Three Fiber - depends on both React and Three.js
            if (id.includes("@react-three")) {
              return "react-three-vendor";
            }
            // Redux core - separate from persist to avoid circular deps
            if (
              id.includes("@reduxjs/toolkit") &&
              !id.includes("redux-persist")
            ) {
              return "redux-core";
            }
            // Redux persist - separate chunk
            if (id.includes("redux-persist")) {
              return "redux-persist";
            }
            // Other redux-related (reselect, etc)
            if (
              (id.includes("redux") || id.includes("reselect")) &&
              !id.includes("redux-persist") &&
              !id.includes("@reduxjs/toolkit")
            ) {
              return "redux-utils";
            }
            // React Router - depends on React
            if (id.includes("react-router")) {
              return "react-router";
            }
            // Framer Motion - separate chunk as it's large
            if (id.includes("framer-motion")) {
              return "animation-vendor";
            }
            // Particles - separate chunk
            if (id.includes("@tsparticles") || id.includes("tsparticles")) {
              return "particles-vendor";
            }
            // OpenAI - separate chunk
            if (id.includes("openai")) {
              return "ai-vendor";
            }
            // UI libraries
            if (id.includes("lucide-react")) {
              return "ui-icons";
            }
            // Markdown
            if (
              id.includes("react-markdown") ||
              id.includes("remark") ||
              id.includes("rehype")
            ) {
              return "markdown-vendor";
            }
            // EmailJS
            if (id.includes("@emailjs")) {
              return "emailjs-vendor";
            }
            // Utility libraries
            if (id.includes("clsx") || id.includes("tailwind-merge")) {
              return "utils-vendor";
            }
            // Font source
            if (id.includes("@fontsource") || id.includes("@vercel/fonts")) {
              return "fonts-vendor";
            }
            // Geist package
            if (id.includes("geist")) {
              return "geist-vendor";
            }
            // Other vendor code - keep together but smaller
            return "vendor";
          }
          // Route-based code splitting
          if (id.includes("/pages/MarketJD")) {
            return "marketjd-page";
          }
          if (id.includes("/pages/Portfolio")) {
            return "portfolio-page";
          }
          // Heavy components
          if (id.includes("ThreeDCarousel") || id.includes("3d-carousel")) {
            return "carousel-components";
          }
          if (
            id.includes("InteractiveCard") ||
            id.includes("interactive-card")
          ) {
            return "interactive-components";
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
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
    target: "esnext", // Target modern browsers for smaller output
    // Enable watch mode optimization
    watch:
      mode === "development"
        ? {
            buildDelay: 100,
          }
        : null,
    // Ensure modules are properly resolved
    modulePreload: {
      polyfill: true,
    },
  },
  // Enable esbuild for faster transpilation and minification
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    legalComments: "none",
    treeShaking: true,
    // FIXED: Only drop console/debugger in production, keep them in dev for debugging
    drop: mode === "production" ? ["console", "debugger"] : [],
    // esbuild minification settings (only used when minify: 'esbuild')
    // The varBindingsPlugin will convert const/let to var after minification
    minifyIdentifiers: mode === "production",
    minifySyntax: mode === "production",
    minifyWhitespace: mode === "production",
    keepNames: false, // Don't keep names in production for smaller bundle
    target: "esnext", // Target modern browsers
  },
}));
