import { tags } from 'virtual-post-tags';
import { useStore } from '../hooks/useStore';
import { useDark } from 'rspress/runtime';

const Tags = () => {
    const { currentTag, setCurrentTag, setCurrentPage } = useStore();
    const isDark = useDark();
    const handleTagClick = (tag: string) => {
        setCurrentTag(currentTag === tag ? null : tag);
        setCurrentPage(1); // 切换标签时重置页码
    };

    return (
        <div className={`p-4 mb-6 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}># 标签</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <button
                        key={tag.name}
                        onClick={() => handleTagClick(tag.name)}
                        type="button"
                        className={`
                            px-3 py-1 text-sm rounded-full transition-colors
                            ${isDark 
                                ? currentTag === tag.name
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : currentTag === tag.name
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }
                        `}
                    >
                        {tag.name} ({tag.count})
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tags;
