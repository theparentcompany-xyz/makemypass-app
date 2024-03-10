import million from 'million/compiler';
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer'; // Import the 'visualizer' plugin

export default defineConfig({
  plugins: [
    million.vite({
      auto: {
        threshold: 0.05,
        skip: ['useBadHook', /badVariable/g],
      },
    }),
    react(),
    visualizer() as PluginOption,
  ],
});
