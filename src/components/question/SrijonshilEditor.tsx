import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SrijonshilStructure } from '@/types';
import { Button, Textarea, Input } from '@/components/ui';

const schema = z.object({
  uddipok: z.string().optional().default(''),
  ko: z.object({ question: z.string().min(1, 'প্রশ্ন লিখুন'), answer: z.string().optional().default('') }),
  kho: z.object({ question: z.string().min(1, 'প্রশ্ন লিখুন'), answer: z.string().optional().default('') }),
  go: z.object({ question: z.string().min(1, 'প্রশ্ন লিখুন'), answer: z.string().optional().default('') }),
  gho: z.object({ question: z.string().min(1, 'প্রশ্ন লিখুন'), answer: z.string().optional().default('') }),
});

type F = z.infer<typeof schema>;

const PARTS = [
  { key: 'ko' as const, bn: 'ক)', full: 'জ্ঞানমূলক প্রশ্ন', marks: '১ নম্বর', color: 'bg-violet-50 border-violet-200' },
  { key: 'kho' as const, bn: 'খ)', full: 'অনুধাবনমূলক প্রশ্ন', marks: '২ নম্বর', color: 'bg-sky-50 border-sky-200' },
  { key: 'go' as const, bn: 'গ)', full: 'প্রয়োগমূলক প্রশ্ন', marks: '৩ নম্বর', color: 'bg-amber-50 border-amber-200' },
  { key: 'gho' as const, bn: 'ঘ)', full: 'উচ্চতর দক্ষতামূলক প্রশ্ন', marks: '৪ নম্বর', color: 'bg-rose-50 border-rose-200' },
];

interface Props {
  initialData?: SrijonshilStructure;
  onSave: (data: SrijonshilStructure) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function SrijonshilEditor({ initialData, onSave, onCancel, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      uddipok: '',
      ko: { question: '', answer: '' },
      kho: { question: '', answer: '' },
      go: { question: '', answer: '' },
      gho: { question: '', answer: '' },
    },
  });

  return (
    <form onSubmit={handleSubmit(d => onSave(d as SrijonshilStructure))} className="space-y-4 p-4">
      {/* Uddipok */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-emerald-800 mb-2">📖 উদ্দীপক <span className="text-emerald-500 font-normal">(ঐচ্ছিক)</span></p>
        <Textarea
          {...register('uddipok')}
          placeholder="উদ্দীপকের পাঠ্যাংশ এখানে লিখুন..."
          rows={3}
        />
      </div>

      {/* Parts */}
      {PARTS.map(part => (
        <div key={part.key} className={`border rounded-2xl p-4 ${part.color}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-700">{part.bn}</span>
              <span className="text-sm font-medium text-gray-600">{part.full}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{part.marks}</span>
          </div>
          <div className="space-y-2">
            <Input
              {...register(`${part.key}.question`)}
              placeholder="প্রশ্ন লিখুন *"
              error={errors[part.key]?.question?.message}
            />
            <Textarea
              {...register(`${part.key}.answer`)}
              placeholder="উত্তর লিখুন (ঐচ্ছিক)"
              rows={2}
            />
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-3 pt-2 pb-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>বাতিল</Button>
        <Button type="submit" fullWidth loading={loading}>সংরক্ষণ করুন</Button>
      </div>
    </form>
  );
}
