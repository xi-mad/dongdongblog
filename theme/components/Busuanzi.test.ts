import { mock, describe, test, expect } from 'bun:test';

// 拦截并 Mock 核心模块，防止加载时去解析虚拟模块引发 ENOENT 报错
mock.module('rspress/runtime', () => {
    return {
        useLocation: () => ({ pathname: '/' }),
        Helmet: () => null,
    };
});

mock.module('fetch-jsonp', () => {
    return {
        default: () => Promise.resolve({
            json: () => Promise.resolve({ site_uv: 0, page_pv: 0, version: 0, site_pv: 0 }),
        }),
    };
});

describe('BusuanziClient', () => {
    test('should fetch and cache page views', async () => {
        // 动态导入以确保 mock 先生效
        const { BusuanziClient } = await import('./Busuanzi');

        let callCount = 0;
        const mockFetcher = async (pathname: string) => {
            callCount++;
            return {
                site_uv: 10,
                page_pv: callCount * 100, // 每次新请求增加数值
                version: 1,
                site_pv: 1000,
            };
        };

        const client = new BusuanziClient(mockFetcher);

        // 1. 第一次获取 `/home`
        const stats1 = await client.getStats('/home');
        expect(stats1.page_pv).toBe(100);
        expect(callCount).toBe(1);

        // 2. 第二次相同获取 `/home`，应命中缓存，不触发 fetcher
        const stats2 = await client.getStats('/home');
        expect(stats2.page_pv).toBe(100);
        expect(callCount).toBe(1);

        // 3. 切换路由获取 `/about`，应触发 fetcher 并更新数据
        const stats3 = await client.getStats('/about');
        expect(stats3.page_pv).toBe(200);
        expect(callCount).toBe(2);
    });

    test('should deduplicate parallel calls for the same pathname', async () => {
        // 动态导入以确保 mock 先生效
        const { BusuanziClient } = await import('./Busuanzi');

        let callCount = 0;
        // 模拟带延迟的 fetcher
        const mockFetcher = async (pathname: string) => {
            callCount++;
            await new Promise((resolve) => setTimeout(resolve, 50));
            return {
                site_uv: 10,
                page_pv: 500,
                version: 1,
                site_pv: 1000,
            };
        };

        const client = new BusuanziClient(mockFetcher);

        // 并行调用 getStats 两次
        const [stats1, stats2] = await Promise.all([
            client.getStats('/parallel'),
            client.getStats('/parallel'),
        ]);

        expect(stats1.page_pv).toBe(500);
        expect(stats2.page_pv).toBe(500);
        expect(callCount).toBe(1); // 关键点：去重生效，fetcher 只调用了一次
    });
});
