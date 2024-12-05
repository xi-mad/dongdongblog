import { create } from 'zustand';

interface TagFilterStore {
    currentTag: string | null;
    setCurrentTag: (tag: string | null) => void;
}

export const useTagFilter = create<TagFilterStore>((set) => ({
    currentTag: null,
    setCurrentTag: (tag) => set({ currentTag: tag }),
}));
