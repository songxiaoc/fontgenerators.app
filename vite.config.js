import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        asciiArt: resolve(__dirname, 'ascii-art-generator.html'),
        fontMixer: resolve(__dirname, 'font-mixer.html'),
        usernameGenerator: resolve(__dirname, 'username-generator.html'),
        autoFontChanger: resolve(__dirname, 'auto-font-changer.html'),
        bratGenerator: resolve(__dirname, 'brat-generator.html'),
        bratFont: resolve(__dirname, 'brat-font.html'),
        bratGreen: resolve(__dirname, 'brat-green.html'),
        gothicFont: resolve(__dirname, 'gothic-font.html'),
        tool: resolve(__dirname, 'discord-colored-text-generator.html'),
        about: resolve(__dirname, 'about.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        termsOfService: resolve(__dirname, 'terms-of-service.html')
      }
    }
  }
});
