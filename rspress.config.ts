import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  base: '/dongdongblog',
  root: path.join(__dirname, 'docs'),
  title: "Dongdong's Blog",
  icon: '/icon.png',
  logo: {
    light: '/icon.png',
    dark: '/icon.png',
  },
  // themeConfig: {
  //   socialLinks: [
  //     {
  //       icon: 'github',
  //       mode: 'link',
  //       content: 'https://github.com/web-infra-dev/rspress',
  //     },
  //   ],
  // },
});
