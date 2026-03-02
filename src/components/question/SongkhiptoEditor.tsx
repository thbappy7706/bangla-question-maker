import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SongkhiptoStructure } from '@/types';
import { Button, Textarea } from '@/components/ui';

const schema = z.object({
  question: z.string().min(1, 'প্রশ্ন লিখুন'),
  answer: z.string().optional().default(''),
});

type F = z.infer<typeof schema>;

interface Props {
  initialData?: SongkhiptoStructure;
  onSave: (data: SongkhiptoStructure) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function SongkhiptoEditor({ initialData, onSave, onCancel, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? { question: '', answer: '' },
  });

  return (
    <form onSubmit={handleSubmit(d => onSave(d as SongkhiptoStructure))} className="space-y-4 p-4">
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-sky-800 mb-2">❓ প্রশ্ন</p>
        <Textarea
          {...register('question')}
          placeholder="সংক্ষিপ্ত প্রশ্ন এখানে লিখুন..."
          rows={4}
          error={errors.question?.message}
        />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">✏️ উত্তর <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span></p>
        <Textarea
          {...register('answer')}
          placeholder="উত্তর এখানে লিখুন..."
          rows={4}
        />
      </div>

      <div className="flex gap-3 pt-2 pb-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>বাতিল</Button>
        <Button type="submit" fullWidth loading={loading}>সংরক্ষণ করুন</Button>
      </div>
    </form>
  );
}
