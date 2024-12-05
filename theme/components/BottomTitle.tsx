import { FC } from 'react';
import { usePageData } from 'rspress/runtime';

interface PageFrontmatter {
    date?: string;
    tags?: string[];
}

interface PageData {
    frontmatter: PageFrontmatter;
}

const BottomTitle: FC = () => {
    const { page } = usePageData();
    const { frontmatter } = page as unknown as PageData;
    const { date, tags = [] } = frontmatter;

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return dateStr
            .replace('T', ' ')
            .replace(/\.\d+Z$/, '')
            .replace(/:\d{2}$/, '');
    };

    return (
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
                                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                # {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BottomTitle;
