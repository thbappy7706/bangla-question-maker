"use client";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(({ id, title, description, variant }) => (
        <div
          key={id}
          className={`rounded-lg border p-4 shadow-lg bg-background text-foreground ${
            variant === "destructive" ? "border-destructive bg-destructive text-destructive-foreground" : "border-border"
          }`}
        >
          {title && <div className="font-semibold text-sm bangla-font">{title}</div>}
          {description && <div className="text-sm text-muted-foreground bangla-font mt-1">{description}</div>}
        </div>
      ))}
    </div>
  );
}
