import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import { ArticlePlugin } from './ArticlePlugin';

const TEST_DIR_NAME = 'temp-test-articles';
const TEST_DIR_PATH = path.join(process.cwd(), TEST_DIR_NAME);

beforeAll(() => {
    if (fs.existsSync(TEST_DIR_PATH)) {
        fs.rmSync(TEST_DIR_PATH, { recursive: true, force: true });
    }
    fs.mkdirSync(TEST_DIR_PATH);
    
    // 创建测试子目录 1
    fs.mkdirSync(path.join(TEST_DIR_PATH, 'post1'));
    fs.writeFileSync(path.join(TEST_DIR_PATH, 'post1', 'index.md'), `---
title: Test Post One
date: 2026-06-22 10:00:00
tags:
  - Tech
  - Coding
categories:
  - Software
---
This is the excerpt for post 1.

---

Content for post 1.
`);

    // 创建测试子目录 2
    fs.mkdirSync(path.join(TEST_DIR_PATH, 'post2'));
    fs.writeFileSync(path.join(TEST_DIR_PATH, 'post2', 'index.mdx'), `---
title: Test Post Two
date: 2026-06-21 12:00:00
tags:
  - Life
categories:
  - General
---
This is the excerpt for post 2.

---

Content for post 2.
`);
});

afterAll(() => {
    if (fs.existsSync(TEST_DIR_PATH)) {
        fs.rmSync(TEST_DIR_PATH, { recursive: true, force: true });
    }
});

describe('ArticlePlugin', () => {
    test('should extract metadata and build pages and modules', () => {
        const plugin = ArticlePlugin({ postsDir: TEST_DIR_NAME });
        
        // 1. 验证插件基本属性
        expect(plugin.name).toBe('article-plugin');
        
        // 2. 运行 beforeBuild 钩子读取文件并解析
        if (plugin.beforeBuild) {
            plugin.beforeBuild();
        }
        
        // 3. 验证 addPages 返回的页面路由和路径
        const pages = plugin.addPages ? plugin.addPages() : [];
        expect(pages).toHaveLength(2);
        
        // 路由应当是以 .html 结尾的相对路径
        const routePaths = pages.map(p => p.routePath).sort();
        expect(routePaths).toEqual([
            '/temp-test-articles/post1.html',
            '/temp-test-articles/post2.html',
        ]);
        
        // 4. 验证 addRuntimeModules 注入的虚拟模块
        const modules = plugin.addRuntimeModules ? plugin.addRuntimeModules() : {};
        expect(modules).toHaveProperty('virtual-post-data');
        expect(modules).toHaveProperty('virtual-post-tags');
        
        // 验证导出的虚拟数据格式
        const postDataStr = (modules as any)['virtual-post-data'];
        expect(postDataStr).toContain('export const posts =');
        
        // 解析注入的 JSON
        const jsonMatch = postDataStr.match(/export const posts = (.*)/);
        expect(jsonMatch).not.toBeNull();
        const posts = JSON.parse(jsonMatch[1]);
        
        // 验证文章数与排序（按日期降序）
        expect(posts).toHaveLength(2);
        expect(posts[0].title).toBe('Test Post One');
        expect(posts[1].title).toBe('Test Post Two');
        expect(posts[0].date).toBe('2026-06-22 10:00:00');
        expect(posts[1].date).toBe('2026-06-21 12:00:00');
        expect(posts[0].tags).toEqual(['Tech', 'Coding']);
        expect(posts[0].excerpt).toContain('This is the excerpt for post 1.');
        
        // 验证标签数与统计结果
        const tagsDataStr = (modules as any)['virtual-post-tags'];
        expect(tagsDataStr).toContain('export const tags =');
        const tagsJsonMatch = tagsDataStr.match(/export const tags = (.*)/);
        expect(tagsJsonMatch).not.toBeNull();
        const tags = JSON.parse(tagsJsonMatch[1]);
        expect(tags).toHaveLength(3); // Tech, Coding, Life
        
        const techTag = tags.find((t: any) => t.name === 'Tech');
        expect(techTag).toBeDefined();
        expect(techTag.count).toBe(1);
    });
});
