import { Helmet, useLocation } from 'rspress/runtime';
import fetchJsonp from 'fetch-jsonp';
import { useEffect, useState } from 'react';

// busuanzi网站统计数据
const websiteData = {
    site_uv: 0,
    page_pv: 0,
    version: 0,
    site_pv: 0,
};
// 目前正在展示的页面路径
let lastPathname = '';
// 上一次请求的promise
let waitPromise = Promise.resolve(websiteData);

// 获取busuanzi网站统计数据，多个页面共享
const fetchSizeInfo = async (pathname: string): Promise<typeof websiteData> => {
    if (pathname !== lastPathname) {
        lastPathname = pathname;
        waitPromise = fetchJsonp('https://busuanzi.ibruce.info/busuanzi', {
            jsonpCallback: 'jsonpCallback',
        })
            .then((res) => res.json())
            .then((data) => {
                websiteData.site_uv = data.site_uv || 0;
                websiteData.page_pv = data.page_pv || 0;
                websiteData.version = data.version || 0;
                websiteData.site_pv = data.site_pv || 0;
                return websiteData;
            })
            .catch((e) => {
                console.error('fetch busuanzi error', e);
                return websiteData;
            });
    }
    await waitPromise;
    return websiteData;
};

export const useBusuanzi = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [pageView, setPageView] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetchSizeInfo(location.pathname)
            .then((data) => {
                setPageView(data.page_pv);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [location.pathname]);

    return { loading, pageView };
};

export const BusuanziMeta = () => (
    <Helmet>
        <meta name="referrer" content="no-referrer-when-downgrade" />
    </Helmet>
);
