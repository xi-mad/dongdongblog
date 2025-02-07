import { RspressPlugin } from '@rspress/shared';
// 获取文章阅读时间
export function readingInfoPlugin(): RspressPlugin {
    return {
        name: 'reading-info-plugin',
        extendPageData(pageData) {
            if (pageData?.frontmatter.layout === 'article') {
                const { content } = pageData;
                const readingTime = getReadingTime(content);
                pageData.readingTime = readingTime.readTime;
                pageData.words = readingTime.words;
            }
        },
    };
}

export function getWords(content: string): RegExpMatchArray | null {
    return content.match(/[\w\d\s,.\u00C0-\u024F\u0400-\u04FF]+/giu);
}

export function getChinese(content: string): RegExpMatchArray | null {
    return content.match(/[\u4E00-\u9FD5]/gu);
}

export function getEnWordCount(content: string): number {
    return (
        getWords(content)?.reduce<number>(
            (accumulator, word) =>
                accumulator +
                (word.trim() === '' ? 0 : word.trim().split(/\s+/u).length),
            0
        ) || 0
    );
}

export function getCnWordCount(content: string): number {
    return getChinese(content)?.length || 0;
}

export function getWordNumber(content: string): number {
    return getEnWordCount(content) + getCnWordCount(content);
}

export function getReadingTime(
    content: string,
    cnWordPerMinute = 350,
    enwordPerMinute = 160
) {
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
