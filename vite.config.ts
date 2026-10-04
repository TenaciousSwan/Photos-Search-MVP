import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {copyFileSync, mkdirSync} from 'node:fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), {
      name: 'copy-prototype-scripts',
      apply: 'build',
      writeBundle() {
        const output = path.resolve(__dirname, 'dist/js');
        const scripts = ['data.js', 'search.js', 'app.js'];
        mkdirSync(output, { recursive: true });
        scripts.forEach((script) => {
          copyFileSync(path.resolve(__dirname, 'js', script), path.join(output, script));
        });
      },
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
