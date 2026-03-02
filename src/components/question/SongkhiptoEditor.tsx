import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SongkhiptoStructure } from '@/types';
import { Button, Textarea } from '@/components/ui';
import { useT } from '@/lib/i18n';

const schema = z.object({
  question: z.string().min(1),
});

type F = z.infer<typeof schema>;

interface Props {
  initialData?: SongkhiptoStructure;
  onSave: (data: SongkhiptoStructure) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function SongkhiptoEditor({ initialData, onSave, onCancel, loading }: Props) {
  const t = useT();
  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? { question: '' },
  });

  return (
    <form onSubmit={handleSubmit(d => onSave(d as SongkhiptoStructure))} className="space-y-4 p-4">
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 dark:bg-sky-900/20 dark:border-sky-800">
        <p className="text-sm font-semibold text-sky-800 dark:text-sky-300 mb-2">{t('songkhipto.question')}</p>
        <Textarea
          {...register('question')}
          placeholder={t('songkhipto.qPh')}
          rows={4}
          error={errors.question?.message ? t('songkhipto.qErr') : undefined}
        />
      </div>

      <div className="flex gap-3 pt-2 pb-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>{t('setForm.cancel')}</Button>
        <Button type="submit" fullWidth loading={loading}>{t('setForm.save')}</Button>
      </div>
    </form>
  );
}
