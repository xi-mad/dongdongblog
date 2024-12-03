import { AdditionalPage, RspressPlugin } from '@rspress/shared';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import matter from 'gray-matter';
import fs, { PathLike } from 'node:fs';
import path from 'node:path';

// 设置时区
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');

interface PostInfo {
    title: string;
    route: string;
    path: string;
    date: string;
    categories: string[];
    tags: string[];
    excerpt: string;
}

interface PostTag {
    name: string;
    count: number;
    posts: PostInfo[];
}

interface PostCategory {
    name: string;
    count: number;
    children: PostCategory[];
    posts: PostInfo[];
}

interface ArticlePluginOptions {
    postsDir: string;
}

class PostDataManager {
    private posts: PostInfo[] = [];
    private categories = new Map<string, PostCategory>();
    private tags = new Map<string, PostTag>();

    addPost(filePath: string) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter, excerpt } = matter(content, {
            excerpt: true,
        });

        // 构建文章路由
        const relativePath = path.relative(process.cwd(), filePath);
        const baseName = path.basename(filePath);
        const route = '/' + relativePath.slice(0, -baseName.length);

        const post: PostInfo = {
            title: frontmatter.title || '',
            route,
            path: filePath,
            date: frontmatter.date
                ? dayjs(frontmatter.date).format('YYYY-MM-DD HH:mm:ss')
                : '',
            categories: Array.isArray(frontmatter.categories)
                ? frontmatter.categories
                : [],
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
            excerpt: excerpt || '',
        };

        this.posts.push(post);
        this.updateCategories(post);
        this.updateTags(post);
    }

    private updateCategories(post: PostInfo) {
        post.categories.forEach((categoryName) => {
            if (!this.categories.has(categoryName)) {
                this.categories.set(categoryName, {
                    name: categoryName,
                    count: 0,
                    children: [],
                    posts: [],
                });
            }
            const category = this.categories.get(categoryName)!;
            category.count++;
            category.posts.push(post);
        });
    }

    private updateTags(post: PostInfo) {
        post.tags.forEach((tagName) => {
            if (!this.tags.has(tagName)) {
                this.tags.set(tagName, {
                    name: tagName,
                    count: 0,
                    posts: [],
                });
            }
            const tag = this.tags.get(tagName)!;
            tag.count++;
            tag.posts.push(post);
        });
    }

    getPosts(): PostInfo[] {
        return this.posts.sort(
            (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
        );
    }

    getCategories(): PostCategory[] {
        return Array.from(this.categories.values());
    }

    getTags(): PostTag[] {
        return Array.from(this.tags.values());
    }
}

function traverseFolder(
    folderPath: PathLike,
    callback: (path: PathLike) => void
) {
    const items = fs.readdirSync(folderPath);
    items.forEach((item) => {
        const itemPath = path.join(folderPath.toString(), item);
        const stats = fs.statSync(itemPath);
        if (stats.isDirectory()) {
            traverseFolder(itemPath, callback);
        } else if (stats.isFile()) {
            callback(itemPath);
        }
    });
}

export function ArticlePlugin(options: ArticlePluginOptions): RspressPlugin {
    const postData = new PostDataManager();

    return {
        name: 'article-plugin',

        beforeBuild() {
            // 遍历文章目录,解析文章信息
            const articlesDir = path.join(process.cwd(), options.postsDir);
            traverseFolder(articlesDir, (itemPath) => {
                const ext = path.extname(itemPath.toString());
                if (['.md', '.mdx'].includes(ext)) {
                    postData.addPost(itemPath.toString());
                }
            });
        },

        addPages() {
            const pages: AdditionalPage[] = [];
            // 为每篇文章添加路由
            postData.getPosts().forEach((post) => {
                pages.push({
                    routePath: post.route,
                    filepath: post.path,
                });
            });
            return pages;
        },

        extendPageData(pageData) {
            // 为文章页面注入额外数据
            if (pageData?.frontmatter.layout === 'article') {
                const posts = postData.getPosts();
                const index = posts.findIndex(
                    (post) => post.route === pageData.routePath
                );

                if (index > -1) {
                    // 添加前后文章导航
                    pageData.prevPost = posts[index + 1];
                    pageData.nextPost = posts[index - 1];

                    // 添加文章元数据
                    const post = posts[index];
                    pageData.date = post.date;
                    pageData.categories = post.categories;
                    pageData.tags = post.tags;
                }
            }
        },

        addRuntimeModules() {
            // 注入运行时数据,供前端使用
            return {
                'virtual-post-data': `
                    export const posts = ${JSON.stringify(postData.getPosts())}
                `,
                'virtual-post-tags': `
                    export const tags = ${JSON.stringify(postData.getTags())}
                `,
            };
        },
    };
}
