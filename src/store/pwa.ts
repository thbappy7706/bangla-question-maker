import { create } from 'zustand';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAStore {
    deferredPrompt: BeforeInstallPromptEvent | null;
    setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
}

export const usePWAStore = create<PWAStore>((set) => ({
    deferredPrompt: null,
    setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
}));
