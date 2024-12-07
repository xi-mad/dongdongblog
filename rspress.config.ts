import * as path from 'node:path';
import { defineConfig } from 'rspress/config';
import { ArticlePlugin } from './plugins/article-plugin/ArticlePlugin';
import { readingInfoPlugin } from './plugins/reading-info-plugin/ReadingInfoPlugin';
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
        readingInfoPlugin(),
    ],

    themeConfig: {
        nav: [
            {
                text: '归档',
                link: '/article/archives',
            },
        ],
        giscus: {
            repo: 'xi-mad/xi-mad.github.io',
            repoId: 'R_kgDONaJbBA',
            category: 'Announcements',
            categoryId: 'DIC_kwDONaJbBM4Ck_44',
        },
    },
});
