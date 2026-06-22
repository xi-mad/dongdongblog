import { describe, test, expect } from 'bun:test';
import { ReadingTimeEstimator, readingInfoPlugin } from './ReadingInfoPlugin';

describe('ReadingTimeEstimator & ReadingInfoPlugin (Post-refactor)', () => {
    test('should calculate reading time for pure English content', () => {
        const text = 'word '.repeat(160);
        const result = ReadingTimeEstimator.estimate(text);
        expect(result.readTime).toBe(1);
        expect(result.words).toBe(160);
    });

    test('should calculate reading time for pure Chinese content', () => {
        const text = '你'.repeat(350);
        const result = ReadingTimeEstimator.estimate(text);
        expect(result.readTime).toBe(1);
        expect(result.words).toBe(350);
    });

    test('should handle mixed content correctly', () => {
        const text = 'Hello 你好 123';
        const result = ReadingTimeEstimator.estimate(text);
        expect(result.words).toBe(4);
        expect(result.readTime).toBe('1'); // < 1 min defaults to '1'
    });

    test('should format large word counts with k', () => {
        const text = '你'.repeat(1200);
        const result = ReadingTimeEstimator.estimate(text);
        expect(result.words).toBe('1.2k');
    });

    test('should extend Rspress pageData in plugin', () => {
        const plugin = readingInfoPlugin();
        const pageData = {
            frontmatter: {
                layout: 'article',
            },
            content: 'Hello 你好 123',
            readingTime: undefined,
            words: undefined,
        } as any;

        if (plugin.extendPageData) {
            plugin.extendPageData(pageData);
        }

        expect(pageData.words).toBe(4);
        expect(pageData.readingTime).toBe('1');
    });
});
