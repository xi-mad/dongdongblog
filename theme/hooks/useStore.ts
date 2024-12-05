import { create } from 'zustand';

interface BlogStore {
    currentTag: string | null;
    currentPage: number;
    setCurrentTag: (tag: string | null) => void;
    setCurrentPage: (page: number) => void;
}

export const useStore = create<BlogStore>((set) => ({
    currentTag: null,
    currentPage: 1,
    setCurrentTag: (tag) => set({ currentTag: tag }),
    setCurrentPage: (page) => {
        set({ currentPage: page });
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
}));
