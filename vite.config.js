import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist/client'),
    assetsDir: 'assets',
    sourcemap: true,
    ssrManifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'client/index.html'),
        'entry-client': path.resolve(__dirname, 'client/entry-client.jsx'),
        'entry-server': path.resolve(__dirname, 'client/entry-server.jsx')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'entry-client' ? 'entry-client.js' : '[name].js'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '/assets': path.resolve(__dirname, './client/assets')
    }
  },
})