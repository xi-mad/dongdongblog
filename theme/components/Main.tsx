import dayjs from 'dayjs';
import { posts } from 'virtual-post-data';
import { usePageData } from 'rspress/runtime';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';

interface PostInfo {
    title: string;
    route: string;
    date: string;
    tags?: string[];
}

const POSTS_PER_PAGE = 5;

const Main = () => {
    const { siteData } = usePageData();
    const { base } = siteData;
    
    const { currentPage, setPage } = usePagination({
        key: 'blog_current_page',
        defaultPage: 1
    });

    // 按日期排序
    const sortedPosts = [...posts].sort(
        (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
    );

    // 计算总页数
    const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

    // 获取当前页的文章
    const currentPosts = sortedPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <header className="flex items-center gap-4 mb-12">
                <img 
                    src={`${base}/icon.png`} 
                    alt="Blog Icon" 
                    className="w-12 h-12 rounded-lg shadow-sm"
                />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Dongdong's Blog
                </h1>
            </header>

            <div className="space-y-6">
                {currentPosts.map((post) => (
                    <article
                        key={post.route}
                        className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <time className="text-sm text-gray-500">
                                {dayjs(post.date).format('YYYY-MM-DD')}
                            </time>
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold mb-2">
                            <a
                                href={`${base}${post.route}`}
                                className="hover:text-blue-500 transition-colors"
                            >
                                {post.title}
                            </a>
                        </h2>
                        {post.excerpt && (
                            <p className="text-gray-600 line-clamp-2 text-sm">
                                {post.excerpt}
                            </p>
                        )}
                    </article>
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default Main;
