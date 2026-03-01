import { useState, useCallback } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toastList: Toast[] = [];

function updateToasts(toasts: Toast[]) {
  toastList = toasts;
  toastListeners.forEach(l => l(toasts));
}

export function toast({ title, description, variant }: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  updateToasts([...toastList, { id, title, description, variant }]);
  setTimeout(() => {
    updateToasts(toastList.filter(t => t.id !== id));
  }, 4000);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastList);
  
  const subscribe = useCallback(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter(l => l !== setToasts);
    };
  }, []);

  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return { toasts, toast };
}
