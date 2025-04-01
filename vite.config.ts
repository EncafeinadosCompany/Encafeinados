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
<<<<<<< HEAD
    cors: true
  }
})
=======
  },
});
>>>>>>> d39ba29cf46370154c2bf22f61450c5789c9f7bf
