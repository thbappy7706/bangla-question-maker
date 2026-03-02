import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { QuestionType, QuestionStructure } from '@/types';
import { useStore } from '@/store';
import { BottomSheet } from '@/components/ui';
import SrijonshilEditor from './SrijonshilEditor';
import SongkhiptoEditor from './SongkhiptoEditor';
import MCQEditor from './MCQEditor';
import { showToast } from '@/components/ui';
import { cn } from '@/lib/utils';

const TYPES: { type: QuestionType; label: string; desc: string; icon: string; color: string }[] = [
  { type: 'srijonshil', label: 'সৃজনশীল', desc: 'উদ্দীপক + ক/খ/গ/ঘ প্রশ্ন', icon: '📖', color: 'bg-violet-50 border-violet-200 active:bg-violet-100' },
  { type: 'songkhipto', label: 'সংক্ষিপ্ত', desc: 'সংক্ষিপ্ত প্রশ্ন ও উত্তর', icon: '✏️', color: 'bg-sky-50 border-sky-200 active:bg-sky-100' },
  { type: 'mcq', label: 'বহুনির্বাচনী (MCQ)', desc: '৪টি বিকল্পসহ প্রশ্ন', icon: '🔘', color: 'bg-emerald-50 border-emerald-200 active:bg-emerald-100' },
];

interface Props { setId: string; }

export default function AddQuestionFAB({ setId }: Props) {
  const { addQuestion } = useStore();
  const [step, setStep] = useState<'closed' | 'select' | QuestionType>('closed');
  const [saving, setSaving] = useState(false);

  const handleSave = (structure: QuestionStructure) => {
    if (step === 'closed' || step === 'select') return;
    setSaving(true);
    addQuestion(setId, step as QuestionType, structure);
    setSaving(false);
    setStep('closed');
    showToast('প্রশ্ন যোগ হয়েছে ✓');
  };

  const close = () => setStep('closed');

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setStep('select')}
        className={cn(
          'fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full shadow-xl',
          'flex items-center justify-center transition-all duration-200 active:scale-95',
          'bg-emerald-600 text-white shadow-emerald-300',
          step !== 'closed' ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        )}
        style={{ bottom: 'calc(24px + env(safe-area-inset-bottom))' }}
        aria-label="প্রশ্ন যোগ করুন"
      >
        <Plus className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Type selector */}
      <BottomSheet open={step === 'select'} onClose={close} title="প্রশ্নের ধরন বেছে নিন">
        <div className="p-4 space-y-3">
          {TYPES.map(t => (
            <button
              key={t.type}
              onClick={() => setStep(t.type)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-150 text-left active:scale-[0.98]',
                t.color
              )}
            >
              <span className="text-3xl">{t.icon}</span>
              <div>
                <p className="font-bold text-gray-900 text-base">{t.label}</p>
                <p className="text-sm text-gray-500 mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Srijonshil editor */}
      <BottomSheet open={step === 'srijonshil'} onClose={close} title="নতুন সৃজনশীল প্রশ্ন">
        <SrijonshilEditor onSave={handleSave} onCancel={close} loading={saving} />
      </BottomSheet>

      {/* Songkhipto editor */}
      <BottomSheet open={step === 'songkhipto'} onClose={close} title="নতুন সংক্ষিপ্ত প্রশ্ন">
        <SongkhiptoEditor onSave={handleSave} onCancel={close} loading={saving} />
      </BottomSheet>

      {/* MCQ editor */}
      <BottomSheet open={step === 'mcq'} onClose={close} title="নতুন MCQ প্রশ্ন">
        <MCQEditor onSave={handleSave} onCancel={close} loading={saving} />
      </BottomSheet>
    </>
  );
}
