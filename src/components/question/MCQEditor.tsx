import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MCQStructure } from '@/types';
import { Button, Textarea, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

const OPT_BN = ['ক', 'খ', 'গ', 'ঘ'];
const OPT_COLORS = [
  'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
];

const schema = z.object({
  question: z.string().min(1),
  options: z.tuple([
    z.string().min(1),
    z.string().min(1),
    z.string().min(1),
    z.string().min(1),
  ]),
});

type F = z.infer<typeof schema>;

interface Props {
  initialData?: MCQStructure;
  onSave: (data: MCQStructure) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function MCQEditor({ initialData, onSave, onCancel, loading }: Props) {
  const t = useT();
  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      question: '',
      options: ['', '', '', ''],
    },
  });

  return (
    <form onSubmit={handleSubmit(d => onSave(d as MCQStructure))} className="space-y-4 p-4">
      {/* Question */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 dark:bg-emerald-900/20 dark:border-emerald-800">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">{t('mcq.question')}</p>
        <Textarea
          {...register('question')}
          placeholder={t('mcq.qPh')}
          rows={3}
          error={errors.question?.message ? t('mcq.qErr') : undefined}
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 px-1">
          {t('mcq.options')}
        </p>
        {[0, 1, 2, 3].map(idx => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className={cn(
                'w-11 h-11 rounded-xl border-2 font-bold text-base flex-shrink-0 flex items-center justify-center',
                OPT_COLORS[idx]
              )}
            >
              {OPT_BN[idx]}
            </div>
            <div className="flex-1">
              <Input
                {...register(`options.${idx}` as 'options.0' | 'options.1' | 'options.2' | 'options.3')}
                placeholder={t('mcq.optPh', OPT_BN[idx])}
                error={errors.options?.[idx]?.message ? t('mcq.optErr') : undefined}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2 pb-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>{t('setForm.cancel')}</Button>
        <Button type="submit" fullWidth loading={loading}>{t('setForm.save')}</Button>
      </div>
    </form>
  );
}
