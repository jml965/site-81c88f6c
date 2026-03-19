import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Include .jsx files
      include: '**/*.{jsx,tsx}',
    }),
  ],
  
  // Development server configuration
  server: {
    host: true, // Listen on all addresses
    port: 3000,
    open: true, // Open browser on server start
    cors: true,
    proxy: {
      // Proxy API requests to backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy Socket.IO requests
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true, // Enable WebSocket proxying
      },
    },
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@services': resolve(__dirname, 'src/services'),
    },
  },
  
  // Build configuration
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for production debugging
    sourcemap: true,
    
    // Rollup options
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // Socket.IO chunk
          realtime: [
            'socket.io-client',
          ],
          // Icons chunk
          icons: [
            'lucide-react',
          ],
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/styles/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Target modern browsers for smaller bundles
    target: 'es2020',
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
      format: {
        comments: false, // Remove comments
      },
    },
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Asset inlining threshold
    assetsInlineLimit: 4096,
  },
  
  // CSS preprocessing
  css: {
    postcss: {
      plugins: [
        // Add autoprefixer if needed
      ],
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  
  // Environment variables
  define: {
    // Global constants
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'socket.io-client',
      'lucide-react',
    ],
    exclude: [
      // Exclude any problematic dependencies
    ],
  },
  
  // PWA and Service Worker (if needed)
  // You can add vite-plugin-pwa here for PWA features
  
  // Preview server (for production build testing)
  preview: {
    host: true,
    port: 4173,
    open: true,
    cors: true,
  },
  
  // Base path (useful for deployment to subdirectories)
  base: '/',
  
  // Public directory
  publicDir: 'public',
  
  // ESBuild options
  esbuild: {
    // Remove console.log in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // JSX factory (if using custom JSX)
    // jsxFactory: 'h',
    // jsxFragment: 'Fragment',
  },
  
  // Experimental features
  experimental: {
    // Enable build optimizations
    renderBuiltUrl: (filename) => {
      // Custom URL rendering for assets
      return `/${filename}`;
    },
  },
  
  // Worker configuration
  worker: {
    format: 'es',
  },
});