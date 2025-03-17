/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@modules': path.resolve(__dirname, './src/modules'),
      '@common': path.resolve(__dirname, './src/common'),
      '@api': path.resolve(__dirname, './src/api'),
    },
  },
});