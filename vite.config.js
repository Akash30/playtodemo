import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist/client'),
    assetsDir: 'assets',
    sourcemap: true,
    ssrManifest: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'entry-client': path.resolve(__dirname, 'client/entry-client.jsx'),
        'entry-server': path.resolve(__dirname, 'client/entry-server.jsx')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '/assets': path.resolve(__dirname, './client/assets')
    }
  },
  server: {
    port: 3000
  }
})