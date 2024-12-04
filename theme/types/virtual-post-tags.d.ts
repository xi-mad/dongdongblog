declare module 'virtual-post-tags' {
    interface Tag {
        name: string;
        count: number;
        posts: Array<{
            title: string;
            route: string;
            date: string;
        }>;
    }

    export const tags: Tag[];
} 