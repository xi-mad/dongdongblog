import { RspressPlugin } from '@rspress/shared';

export interface ReadingTimeResult {
    readTime: string | number;
    words: string | number;
}

// 获取匹配到的英文/数字等单词
function getWords(content: string): RegExpMatchArray | null {
    return content.match(/[\w\d\s,.\u00C0-\u024F\u0400-\u04FF]+/giu);
}

// 获取匹配到的中文汉字
function getChinese(content: string): RegExpMatchArray | null {
    return content.match(/[\u4E00-\u9FD5]/gu);
}

// 获取英文单词总数
function getEnWordCount(content: string): number {
    return (
        getWords(content)?.reduce<number>(
            (accumulator, word) =>
                accumulator +
                (word.trim() === '' ? 0 : word.trim().split(/\s+/u).length),
            0
        ) || 0
    );
}

// 获取中文汉字总数
function getCnWordCount(content: string): number {
    return getChinese(content)?.length || 0;
}

// 获取中英文混合字数总数
function getWordNumber(content: string): number {
    return getEnWordCount(content) + getCnWordCount(content);
}

// 高内聚深层估算模块
export class ReadingTimeEstimator {
    static estimate(
        content: string,
        cnWordPerMinute = 350,
        enwordPerMinute = 160
    ): ReadingTimeResult {
        const count = getWordNumber(content || '');
        const words = count >= 1000 ? `${Math.round(count / 100) / 10}k` : count;

        const enWord = getEnWordCount(content);
        const cnWord = getCnWordCount(content);

        const readingTime = cnWord / cnWordPerMinute + enWord / enwordPerMinute;
        const readTime =
            readingTime < 1 ? '1' : Number.parseInt(`${readingTime}`, 10);

        return {
            readTime,
            words,
        };
    }
}

// Rspress 插件入口
export function readingInfoPlugin(): RspressPlugin {
    return {
        name: 'reading-info-plugin',
        extendPageData(pageData) {
            if (pageData?.frontmatter.layout === 'article') {
                const { content } = pageData;
                const readingTime = ReadingTimeEstimator.estimate(content);
                pageData.readingTime = readingTime.readTime;
                pageData.words = readingTime.words;
            }
        },
    };
}
