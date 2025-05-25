import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: 'src/background.js',
        content: 'src/content.js'
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
});
