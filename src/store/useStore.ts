import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Drama, Episode, WatchProgress } from '@/types/drama';

interface AppState {
    // Theme
    theme: 'dark' | 'light';
    setTheme: (theme: 'dark' | 'light') => void;

    // Search
    searchQuery: string;
    searchHistory: string[];
    setSearchQuery: (query: string) => void;
    addToSearchHistory: (query: string) => void;
    clearSearchHistory: () => void;

    // Watch History
    watchHistory: WatchProgress[];
    addWatchProgress: (progress: WatchProgress) => void;
    getWatchProgress: (episodeId: string) => WatchProgress | undefined;
    clearWatchHistory: () => void;

    // Current Episode (for player)
    currentDrama: Drama | null;
    currentEpisode: Episode | null;
    setCurrentDrama: (drama: Drama | null) => void;
    setCurrentEpisode: (episode: Episode | null) => void;

    // Favorites (future feature)
    favorites: string[]; // drama IDs
    toggleFavorite: (dramaId: string) => void;
    isFavorite: (dramaId: string) => boolean;

    // Sidebar
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Theme
            theme: 'dark',
            setTheme: (theme) => set({ theme }),

            // Search
            searchQuery: '',
            searchHistory: [],
            setSearchQuery: (query) => set({ searchQuery: query }),
            addToSearchHistory: (query) => {
                const trimmed = query.trim();
                if (!trimmed) return;

                const history = get().searchHistory.filter((q) => q !== trimmed);
                set({ searchHistory: [trimmed, ...history].slice(0, 10) });
            },
            clearSearchHistory: () => set({ searchHistory: [] }),

            // Watch History
            watchHistory: [],
            addWatchProgress: (progress) => {
                const history = get().watchHistory.filter(
                    (p) => p.episodeId !== progress.episodeId
                );
                set({ watchHistory: [progress, ...history].slice(0, 50) });
            },
            getWatchProgress: (episodeId) => {
                return get().watchHistory.find((p) => p.episodeId === episodeId);
            },
            clearWatchHistory: () => set({ watchHistory: [] }),

            // Current Episode
            currentDrama: null,
            currentEpisode: null,
            setCurrentDrama: (drama) => set({ currentDrama: drama }),
            setCurrentEpisode: (episode) => set({ currentEpisode: episode }),

            // Favorites
            favorites: [],
            toggleFavorite: (dramaId) => {
                const favorites = get().favorites;
                if (favorites.includes(dramaId)) {
                    set({ favorites: favorites.filter((id) => id !== dramaId) });
                } else {
                    set({ favorites: [...favorites, dramaId] });
                }
            },
            isFavorite: (dramaId) => get().favorites.includes(dramaId),

            // Sidebar
            isSidebarOpen: false,
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            setSidebarOpen: (open) => set({ isSidebarOpen: open }),
        }),
        {
            name: 'rizal-dracin-storage',
            partialize: (state) => ({
                theme: state.theme,
                searchHistory: state.searchHistory,
                watchHistory: state.watchHistory,
                favorites: state.favorites,
            }),
        }
    )
);

export default useStore;
