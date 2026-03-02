import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useToastRef } from './index';
import { cn } from '@/lib/utils';

export function ToastProvider() {
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'error' } | null>(null);
  useToastRef(setToast);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-pop-in">
      <div className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium',
        toast.type === 'error'
          ? 'bg-red-600 text-white'
          : 'bg-gray-900 text-white'
      )}>
        {toast.type === 'error'
          ? <XCircle className="w-4 h-4 flex-shrink-0" />
          : <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
        }
        {toast.msg}
      </div>
    </div>
  );
}
