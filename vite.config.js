import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        tool: resolve(__dirname, 'discord-colored-text-generator/index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        termsOfService: resolve(__dirname, 'terms-of-service.html')
      }
    }
  }
});
