declare module 'virtual-post-data' {
    export interface Post {
        title: string;
        route: string;
        path: string;
        date: string;
        categories: string[];
        tags: string[];
        excerpt: string;
    }

    export const posts: Post[];
}
