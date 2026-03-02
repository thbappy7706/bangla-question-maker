import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

// ─── Button ───────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type BtnSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantCls: Record<BtnVariant, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30',
  secondary: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50',
  ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
};

const sizeCls: Record<BtnSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-4 text-base rounded-xl gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2',
  icon: 'h-10 w-10 rounded-xl justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center font-medium transition-all duration-150 select-none',
        'disabled:opacity-50 disabled:pointer-events-none',
        'active:scale-[0.97]',
        variantCls[variant],
        sizeCls[size],
        fullWidth && 'w-full justify-center',
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : children}
    </button>
  )
);
Button.displayName = 'Button';

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label;
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 px-4 rounded-xl border bg-white text-gray-900 placeholder-gray-400',
            'dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500',
            'transition-all duration-150',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
              : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-600 dark:focus:ring-emerald-900/30',
            'focus:outline-none',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label;
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white text-gray-900 placeholder-gray-400 resize-none',
            'dark:bg-white/5 dark:text-gray-100 dark:placeholder-gray-500',
            'transition-all duration-150',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30'
              : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-gray-600 dark:focus:ring-emerald-900/30',
            'focus:outline-none leading-relaxed',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'srijonshil' | 'songkhipto' | 'mcq' | 'gray';
const badgeCls: Record<BadgeVariant, string> = {
  srijonshil: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  songkhipto: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  mcq: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
};

export function Badge({ variant = 'gray', children, className }: {
  variant?: BadgeVariant; children: React.ReactNode; className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', badgeCls[variant], className)}>
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className, onClick }: {
  children: React.ReactNode; className?: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-sm',
        'dark:bg-white/5 dark:border-white/10 dark:backdrop-blur-sm',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform duration-100 hover-card',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-gray-100 my-3 dark:bg-gray-700', className)} />;
}

// ─── BottomSheet ──────────────────────────────────────────────────────────────
export function BottomSheet({
  open, onClose, children, title
}: {
  open: boolean; onClose: () => void; children: React.ReactNode; title?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a]/80 dark:backdrop-blur-xl rounded-3xl animate-pop-in max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-white/10">
          {title ? (
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          ) : <div />}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }: {
  icon: string; title: string; desc?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-bold text-gray-700 dark:text-gray-200 text-lg mb-1">{title}</h3>
      {desc && <p className="text-gray-400 dark:text-gray-500 text-sm mb-5 leading-relaxed">{desc}</p>}
      {action}
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('shimmer-bg rounded-xl', className)} />;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let _setToast: ((t: { msg: string; type?: 'success' | 'error' } | null) => void) | null = null;

export function useToastRef(setter: typeof _setToast) {
  _setToast = setter;
}

export function showToast(msg: string, type: 'success' | 'error' = 'success') {
  _setToast?.({ msg, type });
  setTimeout(() => _setToast?.(null), 2800);
}
