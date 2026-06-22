import { Helmet, useLocation } from 'rspress/runtime';
import fetchJsonp from 'fetch-jsonp';
import { useEffect, useState } from 'react';

export interface WebsiteStats {
    site_uv: number;
    page_pv: number;
    version: number;
    site_pv: number;
}

export type StatsFetcher = (pathname: string) => Promise<WebsiteStats>;

// 默认的 jsonp 获取逻辑，支持 SSR / Node 环境安全返回
export const defaultBusuanziFetcher: StatsFetcher = async () => {
    if (typeof window === 'undefined') {
        return { site_uv: 0, page_pv: 0, version: 0, site_pv: 0 };
    }
    const res = await fetchJsonp('https://busuanzi.ibruce.info/busuanzi', {
        jsonpCallback: 'jsonpCallback',
    });
    const data = await res.json();
    return {
        site_uv: data.site_uv || 0,
        page_pv: data.page_pv || 0,
        version: data.version || 0,
        site_pv: data.site_pv || 0,
    };
};

// 面向对象的深层 Client 模块，管理自身的缓存与并发去重机制
export class BusuanziClient {
    private lastPathname = '';
    private waitPromise: Promise<WebsiteStats>;
    private websiteData: WebsiteStats = {
        site_uv: 0,
        page_pv: 0,
        version: 0,
        site_pv: 0,
    };
    private fetcher: StatsFetcher;

    constructor(fetcher: StatsFetcher = defaultBusuanziFetcher) {
        this.fetcher = fetcher;
        this.waitPromise = Promise.resolve(this.websiteData);
    }

    async getStats(pathname: string): Promise<WebsiteStats> {
        if (pathname !== this.lastPathname) {
            this.lastPathname = pathname;
            this.waitPromise = this.fetcher(pathname)
                .then((data) => {
                    this.websiteData.site_uv = data.site_uv || 0;
                    this.websiteData.page_pv = data.page_pv || 0;
                    this.websiteData.version = data.version || 0;
                    this.websiteData.site_pv = data.site_pv || 0;
                    return this.websiteData;
                })
                .catch((e) => {
                    console.error('fetch busuanzi error', e);
                    return this.websiteData;
                });
        }
        await this.waitPromise;
        return this.websiteData;
    }
}

// 缓存单例 Client，避免多组件重复实例化
let globalClient: BusuanziClient | null = null;
export const getGlobalBusuanziClient = (): BusuanziClient => {
    if (!globalClient) {
        globalClient = new BusuanziClient(defaultBusuanziFetcher);
    }
    return globalClient;
};

// React 钩子，支持自定义 Client 注入以方便测试
export const useBusuanzi = (client: BusuanziClient = getGlobalBusuanziClient()) => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [pageView, setPageView] = useState(0);

    useEffect(() => {
        setLoading(true);
        client.getStats(location.pathname)
            .then((data) => {
                setPageView(data.page_pv);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [location.pathname, client]);

    return { loading, pageView };
};

export const BusuanziMeta = () => (
    <Helmet>
        <meta name="referrer" content="no-referrer-when-downgrade" />
    </Helmet>
);
