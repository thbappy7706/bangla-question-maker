import { usePWAStore } from '@/store/pwa';
import { Download } from 'lucide-react';
import { useT } from '@/lib/i18n';

export function PWAInstallButton() {
    const t = useT();
    const { deferredPrompt, setDeferredPrompt } = usePWAStore();

    if (!deferredPrompt) return null;

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <button
            onClick={handleInstall}
            className="flex items-center gap-2 px-2.5 h-8 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all active:scale-95 animate-pulse shadow-lg shadow-emerald-500/20"
            title={t('pwa.install')}
        >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                {t('pwa.install')}
            </span>
        </button>
    );
}
