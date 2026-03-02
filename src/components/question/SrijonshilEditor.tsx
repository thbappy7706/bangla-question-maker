import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SrijonshilStructure } from '@/types';
import { Button, Textarea, Input } from '@/components/ui';
import { useT } from '@/lib/i18n';

const schema = z.object({
  uddipok: z.string().optional().default(''),
  ko: z.object({ question: z.string().min(1) }),
  kho: z.object({ question: z.string().min(1) }),
  go: z.object({ question: z.string().min(1) }),
  gho: z.object({ question: z.string().min(1) }),
});

type F = z.infer<typeof schema>;

interface Props {
  initialData?: SrijonshilStructure;
  onSave: (data: SrijonshilStructure) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function SrijonshilEditor({ initialData, onSave, onCancel, loading }: Props) {
  const t = useT();
  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      uddipok: '',
      ko: { question: '' },
      kho: { question: '' },
      go: { question: '' },
      gho: { question: '' },
    },
  });

  const PARTS = [
    { key: 'ko' as const, bn: 'ক)', full: t('srijonshil.ko'), marks: t('srijonshil.koMarks'), color: 'bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800' },
    { key: 'kho' as const, bn: 'খ)', full: t('srijonshil.kho'), marks: t('srijonshil.khoMarks'), color: 'bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:border-sky-800' },
    { key: 'go' as const, bn: 'গ)', full: t('srijonshil.go'), marks: t('srijonshil.goMarks'), color: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' },
    { key: 'gho' as const, bn: 'ঘ)', full: t('srijonshil.gho'), marks: t('srijonshil.ghoMarks'), color: 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800' },
  ];

  return (
    <form onSubmit={handleSubmit(d => onSave(d as SrijonshilStructure))} className="space-y-4 p-4">
      {/* Uddipok */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 dark:bg-emerald-900/20 dark:border-emerald-800">
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">{t('srijonshil.uddipok')} <span className="text-emerald-500 dark:text-emerald-400 font-normal">{t('srijonshil.uddipokOpt')}</span></p>
        <Textarea
          {...register('uddipok')}
          placeholder={t('srijonshil.uddipokPh')}
          rows={3}
        />
      </div>

      {/* Parts */}
      {PARTS.map(part => (
        <div key={part.key} className={`border rounded-2xl p-4 ${part.color}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-200">{part.bn}</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{part.full}</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{part.marks}</span>
          </div>
          <Input
            {...register(`${part.key}.question`)}
            placeholder={t('srijonshil.qPh')}
            error={errors[part.key]?.question?.message ? t('srijonshil.qErr') : undefined}
          />
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-3 pt-2 pb-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>{t('setForm.cancel')}</Button>
        <Button type="submit" fullWidth loading={loading}>{t('setForm.save')}</Button>
      </div>
    </form>
  );
}
