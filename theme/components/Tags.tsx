import { tags } from 'virtual-post-tags';
import { useStore } from '../hooks/useStore';

const Tags = () => {
    const { currentTag, setCurrentTag, setCurrentPage } = useStore();

    const handleTagClick = (tag: string) => {
        setCurrentTag(currentTag === tag ? null : tag);
        setCurrentPage(1); // 切换标签时重置页码
    };

    return (
        <div className="p-4 mb-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-3"># 标签</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <button
                        key={tag.name}
                        onClick={() => handleTagClick(tag.name)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            currentTag === tag.name ? 'bg-gray-400' : ''
                        }`}
                    >
                        {tag.name} ({tag.count})
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tags;
