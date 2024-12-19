import { FC } from 'react';
import { usePageData } from 'rspress/runtime';
import { useBusuanzi, BusuanziMeta } from './Busuanzi';
import { useDark } from 'rspress/runtime';


interface PageFrontmatter {
    date?: string;
    tags?: string[];
}

interface PageData {
    frontmatter: PageFrontmatter;
    readingTime?: number;
    words?: string | number;
}

const BottomTitle: FC = () => {
    const { page } = usePageData();
    const { frontmatter, readingTime, words } = page as unknown as PageData;
    const { date, tags = [] } = frontmatter;
    const { loading, pageView } = useBusuanzi();
    const isDark = useDark();
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return dateStr
            .replace('T', ' ')
            .replace(/\.\d+Z$/, '')
            .replace(/:\d{2}$/, '');
    };

    return (
        <>
            <BusuanziMeta />
            <div className="flex items-center gap-4 text-sm text-gray-500 -mt-5 -mb-6">
                {date && (
                    <time className="flex items-center gap-1">
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                        </svg>
                        {formatDate(date)}
                    </time>
                )}
                {tags.length > 0 && (
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M10.9 2.1l9.899 1.415 1.414 9.9-9.192 9.192a1 1 0 0 1-1.414 0l-9.9-9.9a1 1 0 0 1 0-1.414L10.9 2.1zm.707 2.122L3.828 12l8.486 8.485 7.778-7.778-1.06-7.425-7.425-1.06zm2.12 6.364a2 2 0 1 1 2.83-2.829 2 2 0 0 1-2.83 2.829z" />
                        </svg>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className={`
                                        px-2 py-0.5 text-xs rounded-full transition-colors
                                        ${isDark 
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }
                                    `}
                                >
                                    # {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {words && (
                    <div className="flex items-center gap-1">
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z" />
                        </svg>
                        <span>{words} 字</span>
                    </div>
                )}
                {readingTime && (
                    <div className="flex items-center gap-1">
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                        <span>{readingTime} min</span>
                    </div>
                )}
                {!loading && pageView > 0 && (
                    <div className="flex items-center gap-1">
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                        <span>{pageView} 次</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default BottomTitle;
