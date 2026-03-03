import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MCQStructure, MCQSubType } from '@/types';
import { Button, Textarea, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

const OPT_BN = ['ক', 'খ', 'গ', 'ঘ'];
const ST_BN = ['i', 'ii', 'iii'];

const OPT_COLORS = [
  'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
];

const schema = z.object({
  mcqType: z.enum(['general', 'multi', 'unified']),
  question: z.string().min(1, { message: 'Required' }),
  stem: z.string().optional(),
  statements: z.tuple([z.string(), z.string(), z.string()]).optional(),
  options: z.tuple([
    z.string().min(1, { message: 'Required' }),
    z.string().min(1, { message: 'Required' }),
    z.string().min(1, { message: 'Required' }),
    z.string().min(1, { message: 'Required' }),
  ]),
});

type F = z.infer<typeof schema>;

interface Props {
  initialData?: MCQStructure;
  onSave: (data: MCQStructure) => void;
  onAddMore?: (data: MCQStructure) => void;
  onCancel: () => void;
  loading?: boolean;
  nextNum?: number;
}

export default function MCQEditor({ initialData, onSave, onAddMore, onCancel, loading, nextNum }: Props) {
  const t = useT();
  const [activeTab, setActiveTab] = useState<MCQSubType>(initialData?.mcqType ?? 'general');

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: {
      mcqType: initialData?.mcqType ?? 'general',
      question: initialData?.question ?? '',
      stem: initialData?.stem ?? '',
      statements: initialData?.statements ?? ['', '', ''],
      options: initialData?.options ?? ['', '', '', ''],
    },
  });

  // Update mcqType when tab changes
  useEffect(() => {
    setValue('mcqType', activeTab);
    if (activeTab === 'multi') {
      const currentOptions = watch('options');
      if (currentOptions.every(o => !o)) {
        setValue('options', ['i ও ii', 'i ও iii', 'ii ও iii', 'i, ii ও iii']);
      }
    }
  }, [activeTab, setValue, watch]);

  const tabs: { id: MCQSubType; label: string }[] = [
    { id: 'general', label: t('mcq.type.general') },
    { id: 'multi', label: t('mcq.type.multi') },
    { id: 'unified', label: t('mcq.type.unified') },
  ];

  const handleAddMore = async () => {
    const isValid = await trigger();
    if (isValid) {
      const data = watch();
      onAddMore?.(data as MCQStructure);
      setValue('question', '');
      setValue('options', ['', '', '', '']);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      {!initialData && (
        <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-white dark:bg-emerald-600 text-emerald-700 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(d => onSave(d as MCQStructure))} className="space-y-5">

        {/* Stem for Unified Info */}
        {activeTab === 'unified' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 dark:bg-amber-900/20 dark:border-amber-800">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">{t('mcq.stem')}</p>
            <Textarea
              {...register('stem')}
              placeholder={t('mcq.stemPh')}
              rows={3}
            />
          </div>
        )}

        {/* Question Stem */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 dark:bg-emerald-900/20 dark:border-emerald-800">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              {t('mcq.question')}
            </p>
            {nextNum && (
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Q {nextNum}
              </span>
            )}
          </div>
          <Textarea
            {...register('question')}
            placeholder={t('mcq.qPh')}
            rows={2}
            error={errors.question?.message ? t('mcq.qErr') : undefined}
          />
        </div>

        {/* Statements for Multi-completion */}
        {activeTab === 'multi' && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 px-1">
              {t('mcq.statements')}
            </p>
            <div className="space-y-3">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold text-sm flex-shrink-0 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/5">
                    {ST_BN[idx]}
                  </div>
                  <div className="flex-1">
                    <Input
                      {...register(`statements.${idx}` as any)}
                      placeholder={t('mcq.statementPh', ST_BN[idx])}
                      className="h-10 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options Grid */}
        <div className="space-y-3">
          {activeTab !== 'unified' && (
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 px-1">
              {t('mcq.options')}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
            {[0, 1, 2, 3].map(idx => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50/50 dark:bg-white/5 p-2 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-colors">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl border-2 font-bold text-sm flex-shrink-0 flex items-center justify-center shadow-sm',
                    OPT_COLORS[idx]
                  )}
                >
                  {OPT_BN[idx]}
                </div>
                <div className="flex-1">
                  <Input
                    {...register(`options.${idx}` as any)}
                    placeholder={t('mcq.optPh', OPT_BN[idx])}
                    error={errors.options?.[idx]?.message ? t('mcq.optErr') : undefined}
                    className="h-10 text-sm border-none bg-transparent focus:ring-0 px-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          {activeTab === 'unified' && !initialData && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleAddMore}
              className="border-emerald-200 dark:border-emerald-800"
            >
              + {t('mcq.addMore')}
            </Button>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="outline" fullWidth onClick={onCancel}>{t('setForm.cancel')}</Button>
            <Button type="submit" fullWidth loading={loading} className="flex-1">{t('setForm.save')}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
