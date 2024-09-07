import react from '@vitejs/plugin-react';
import million from 'million/compiler';
import { visualizer } from 'rollup-plugin-visualizer'; // Import the 'visualizer' plugin
import { defineConfig, type PluginOption } from 'vite';

const _plugins = [
  million.vite({
    auto: {
      threshold: 0.05,
      skip: ['useBadHook', /badVariable/g],
    },
  }),
  react(),
  visualizer() as PluginOption,
];
export default defineConfig({
  plugins: _plugins,
});
