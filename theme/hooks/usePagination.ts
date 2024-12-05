import { useState } from 'react';

interface PaginationOptions {
    key: string;
    defaultPage?: number;
    onChange?: (page: number) => void;
}

export const usePagination = (options: PaginationOptions) => {
    const { key, defaultPage = 1, onChange } = options;

    // 从 localStorage 获取初始页码
    const getStoredPage = () => {
        if (typeof window === 'undefined') return defaultPage;
        const stored = localStorage.getItem(key);
        const page = stored ? parseInt(stored) : defaultPage;
        return isNaN(page) ? defaultPage : page;
    };

    const [currentPage, setCurrentPage] = useState(getStoredPage);

    // 处理页码变更
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, page.toString());
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onChange?.(page);
    };

    return {
        currentPage,
        setPage: handlePageChange,
    };
};
