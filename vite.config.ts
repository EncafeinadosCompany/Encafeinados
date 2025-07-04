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
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          lodash: ['lodash'],
          jsPDF: ['jspdf'],
          html2canvas: ['html2canvas'],
          reactQuery: ['@tanstack/react-query'],
          framerMotion: ['framer-motion'],
          reactHookForm: ['react-hook-form'],
          lucideReact: ['lucide-react'],
          HTMLFlipBook: ['react-pageflip'],
          reactRouterDom: ['react-router-dom'],
          Html5Qrcode: ['html5-qrcode'],
          dateFns: ['date-fns'],
          reactSelect: ['react-select'],
          toast: ['react-hot-toast'],
          dateFnsLocale: ['date-fns/locale'],
          cryptoJS: ['crypto-js'],
          reactLeaflet: ['react-leaflet', 'leaflet'],
          recoil: ['recoil'],
          reactI18next: ['react-i18next'],
        },
      },
    },
  }
})
