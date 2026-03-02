import { useState } from 'react';
import { Plus } from 'lucide-react';
import { QuestionType, QuestionStructure } from '@/types';
import { useStore } from '@/store';
import { BottomSheet } from '@/components/ui';
import SrijonshilEditor from './SrijonshilEditor';
import SongkhiptoEditor from './SongkhiptoEditor';
import MCQEditor from './MCQEditor';
import { showToast } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

interface Props { setId: string; isMCQOnly?: boolean; }

export default function AddQuestionFAB({ setId, isMCQOnly }: Props) {
  const t = useT();
  const { addQuestion } = useStore();
  const [step, setStep] = useState<'closed' | 'select' | QuestionType>('closed');
  const [saving, setSaving] = useState(false);

  const handleClick = () => {
    if (isMCQOnly) setStep('mcq');
    else setStep('select');
  };

  const TYPES: { type: QuestionType; label: string; desc: string; icon: string; color: string }[] = [
    { type: 'srijonshil', label: t('qtype.srijonshil'), desc: t('fab.srijonshilDesc'), icon: '📖', color: 'bg-violet-50 border-violet-200 active:bg-violet-100 dark:bg-violet-900/20 dark:border-violet-700 dark:active:bg-violet-900/40' },
    { type: 'songkhipto', label: t('qtype.songkhipto'), desc: t('fab.songkhiptoDesc'), icon: '✏️', color: 'bg-sky-50 border-sky-200 active:bg-sky-100 dark:bg-sky-900/20 dark:border-sky-700 dark:active:bg-sky-900/40' },
    { type: 'mcq', label: 'MCQ', desc: t('fab.mcqDesc'), icon: '🔘', color: 'bg-emerald-50 border-emerald-200 active:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-700 dark:active:bg-emerald-900/40' },
  ];

  const handleSave = (structure: QuestionStructure) => {
    if (step === 'closed' || step === 'select') return;
    setSaving(true);
    addQuestion(setId, step as QuestionType, structure);
    setSaving(false);
    setStep('closed');
    showToast(t('toast.qAdded'));
  };

  const close = () => setStep('closed');

  return (
    <>
      {/* FAB */}
      <button
        onClick={handleClick}
        className={cn(
          'fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full shadow-xl',
          'flex items-center justify-center transition-all duration-200 active:scale-95',
          'bg-emerald-600 text-white shadow-emerald-300 dark:shadow-emerald-900/50',
          step !== 'closed' ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        )}
        style={{ bottom: 'calc(24px + env(safe-area-inset-bottom))' }}
        aria-label={t('fab.addQ')}
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Type selector */}
      <BottomSheet open={step === 'select'} onClose={close} title={t('fab.selectType')}>
        <div className="p-4 space-y-3">
          {TYPES.map(tp => (
            <button
              key={tp.type}
              onClick={() => setStep(tp.type)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-150 text-left active:scale-[0.98]',
                tp.color
              )}
            >
              <span className="text-3xl">{tp.icon}</span>
              <div>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-base">{tp.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{tp.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Srijonshil editor */}
      <BottomSheet open={step === 'srijonshil'} onClose={close} title={t('edit.srijonshil.new')}>
        <SrijonshilEditor onSave={handleSave} onCancel={close} loading={saving} />
      </BottomSheet>

      {/* Songkhipto editor */}
      <BottomSheet open={step === 'songkhipto'} onClose={close} title={t('edit.songkhipto.new')}>
        <SongkhiptoEditor onSave={handleSave} onCancel={close} loading={saving} />
      </BottomSheet>

      {/* MCQ editor */}
      <BottomSheet open={step === 'mcq'} onClose={close} title={t('edit.mcq.new')}>
        <MCQEditor onSave={handleSave} onCancel={close} loading={saving} />
      </BottomSheet>
    </>
  );
}
