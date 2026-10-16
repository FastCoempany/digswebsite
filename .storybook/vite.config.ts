import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';

/** Storybook's own Vite config: Tailwind + the `~` alias, without the Hydrogen/Oxygen/React Router plugins. */
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {'~': fileURLToPath(new URL('../app', import.meta.url))},
  },
  define: {'process.env.NODE_ENV': JSON.stringify('development')},
});
