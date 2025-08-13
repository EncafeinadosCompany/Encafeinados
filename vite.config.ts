import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import istanbul from "vite-plugin-istanbul";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    istanbul({
      include: "src/*",
      exclude: ["node_modules", "cypress"],
      extension: [".ts", ".tsx"],
      cypress: true,
      requireEnv: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendorUI: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select'],
          vendorForms: ['zod'],
          vendorScanner: ['html5-qrcode'],
          lodash: ['lodash'],
          jsPDF: ['jspdf'],
          html2canvas: ['html2canvas'],
          reactQuery: ['@tanstack/react-query'],
          framerMotion: ['framer-motion'],
          reactHookForm: ['react-hook-form'],
          lucideReact: ['lucide-react'],
          reactRouterDom: ['react-router-dom'],
          dateFns: ['date-fns'],
          reactSelect: ['react-select'],
          toast: ['react-hot-toast'],
          dateFnsLocale: ['date-fns/locale'],
          cryptoJS: ['crypto-js'],
          reactLeaflet: ['react-leaflet', 'leaflet'],
          recoil: ['recoil'],
          reactI18next: ['react-i18next'],
          swiper: ['swiper/react', 'swiper/modules'],
        },
      },
    },
     // Aumentar el límite de advertencia temporalmente
    chunkSizeWarningLimit: 600,
    // Optimizaciones adicionales
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs en producción
        drop_debugger: true,
      },
    }
  }
});
