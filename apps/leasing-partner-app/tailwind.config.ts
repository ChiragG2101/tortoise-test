// tailwind config is required for editor support

import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/ui/design-tailwind-config';

const config: Pick<Config, 'content' | 'presets' | 'plugins' | 'theme'> = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#16AF8E',
          main: '#16AF8E',
          dark: '#114036',
          contrastText: '#FFFFFF',
        },
      },
    },
  },
};

export default config;
