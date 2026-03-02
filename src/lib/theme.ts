import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: 'light',
            setTheme: (theme) => {
                document.documentElement.classList.toggle('dark', theme === 'dark');
                set({ theme });
            },
            toggleTheme: () => {
                const next = get().theme === 'light' ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', next === 'dark');
                set({ theme: next });
            },
        }),
        {
            name: 'bqm-theme',
            version: 1,
            onRehydrateStorage: () => (state) => {
                if (state?.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                }
            },
        }
    )
);
