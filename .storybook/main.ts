import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../app/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {name: '@storybook/react-vite', options: {}},
  core: {
    disableTelemetry: true,
    builder: {name: '@storybook/builder-vite', options: {viteConfigPath: '.storybook/vite.config.ts'}},
  },
  staticDirs: ['../public'],
  typescript: {reactDocgen: 'react-docgen'},
};

export default config;
