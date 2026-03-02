import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Download, RefreshCw, X } from 'lucide-react';

// ─── Update Prompt ─────────────────────────────────────────────────────────────
export function PWAUpdatePrompt() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: ServiceWorkerRegistration | undefined) {
            // Check for updates every 30 minutes
            r && setInterval(() => r.update(), 30 * 60 * 1000);
        },
    });

    const close = () => setNeedRefresh(false);

    if (!needRefresh) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 animate-pop-in">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">নতুন আপডেট আছে!</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">New version available. Reload to update.</p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => updateServiceWorker(true)}
                            className="flex-1 bg-emerald-600 text-white text-xs font-semibold py-2 px-3 rounded-xl hover:bg-emerald-700 transition-colors active:scale-95"
                        >
                            আপডেট করুন
                        </button>
                        <button
                            onClick={close}
                            className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                            পরে
                        </button>
                    </div>
                </div>
                <button
                    onClick={close}
                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Install Banner ────────────────────────────────────────────────────────────
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Don't show if already dismissed in this session
        if (sessionStorage.getItem('pwa-install-dismissed')) return;

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        sessionStorage.setItem('pwa-install-dismissed', '1');
        setDismissed(true);
    };

    if (!deferredPrompt || dismissed) return null;

    return (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 animate-pop-in">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-2xl p-4 flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                    📝
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">QuestionCraft ইনস্টল করুন</p>
                    <p className="text-xs text-emerald-100 mt-0.5">হোম স্ক্রিনে যোগ করুন • অফলাইনে ব্যবহার করুন</p>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleInstall}
                            className="flex-1 bg-white text-emerald-700 text-xs font-bold py-1.5 px-3 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                        >
                            <Download className="w-3.5 h-3.5" />
                            ইনস্টল করুন
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors"
                        >
                            পরে
                        </button>
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0 self-start"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
