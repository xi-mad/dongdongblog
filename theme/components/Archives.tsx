import dayjs from 'dayjs';
import { posts } from 'virtual-post-data';
import { usePageData } from 'rspress/runtime';

interface PostInfo {
    title: string;
    route: string;
    date: string;
}

interface YearGroup {
    year: string;
    posts: PostInfo[];
}

const Archives = () => {
    const { siteData } = usePageData();
    const { base } = siteData;

    // 按年份分组
    const groupedPosts = posts.reduce((groups: YearGroup[], post) => {
        const year = dayjs(post.date).format('YYYY');
        const existingGroup = groups.find((g) => g.year === year);

        if (existingGroup) {
            existingGroup.posts.push(post);
        } else {
            groups.push({ year, posts: [post] });
        }

        return groups;
    }, []);

    // 对年份组和组内文章进行排序
    groupedPosts.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    groupedPosts.forEach((group) => {
        group.posts.sort(
            (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
        );
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-4xl font-bold mb-8">归档</h2>
            {groupedPosts.map((group) => (
                <div key={group.year} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{group.year}</h2>
                    <ul className="space-y-3">
                        {group.posts.map((post) => (
                            <li key={post.route} className="flex items-center">
                                <span className="text-gray-500 w-32">
                                    {dayjs(post.date).format('YYYY-MM-DD')}  
                                </span>
                                <a
                                    href={`${base}${post.route}`}
                                    className="hover:text-blue-500"
                                >
                                    {post.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Archives;
