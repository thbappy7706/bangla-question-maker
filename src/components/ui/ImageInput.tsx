import { useRef, ChangeEvent } from 'react';
import { Button } from './index';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export function ImageInput({ value, onChange, label, className }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check size (limit to 1MB to keep local storage happy)
        if (file.size > 1024 * 1024) {
            alert("Image size should be less than 1MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}

            {!value ? (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-emerald-500 hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all active:scale-[0.98]"
                >
                    <Upload className="w-6 h-6" />
                    <span className="text-xs font-semibold">Upload Image</span>
                </button>
            ) : (
                <div className="relative group rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm transition-all bg-gray-50 dark:bg-black/20">
                    <img src={value} alt="Preview" className="w-full h-auto max-h-48 object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-8 px-3 rounded-lg"
                        >
                            <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Change
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={() => onChange('')}
                            className="h-8 px-3 rounded-lg bg-red-500 text-white border-none hover:bg-red-600"
                        >
                            <X className="w-3.5 h-3.5 mr-1.5" /> Remove
                        </Button>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
