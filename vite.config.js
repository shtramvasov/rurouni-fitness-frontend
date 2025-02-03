import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@api': '/src/api/',
      '@store': '/src/store/',
      '@pages': '/src/pages/',
      '@components': '/src/components/',
      '@router': '/src/router/',
      '@constants': '/src/constants/',
      '@theme': '/src/theme/',
      '@hooks': '/src/hooks/',
      '@helpers': '/src/helpers/',
    }
  }
});
