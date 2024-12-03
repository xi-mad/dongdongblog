import * as path from 'node:path';
import { defineConfig } from 'rspress/config';
import { ArticlePlugin } from './plugins/article-plugin/ArticlePlugin';
export default defineConfig({
    base: '/dongdongblog',
    root: path.join(__dirname, 'docs'),
    title: "Dongdong's Blog",
    icon: '/icon.png',
    globalStyles: path.join(__dirname, 'styles/index.css'),
    plugins: [
        ArticlePlugin({
            postsDir: 'article',
        }),
    ],
    themeConfig: {
        nav: [
            {
                text: '归档',
                link: '/article/archives',
            },
        ],
    },
});
