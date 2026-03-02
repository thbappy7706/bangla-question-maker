import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MCQStructure } from '@/types';
import { Button, Textarea, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

const schema = z.object({
  question: z.string().min(1, 'প্রশ্ন লিখুন'),
  options: z.tuple([
    z.string().min(1, 'বিকল্প লিখুন'),
    z.string().min(1, 'বিকল্প লিখুন'),
    z.string().min(1, 'বিকল্প লিখুন'),
    z.string().min(1, 'বিকল্প লিখুন'),
  ]),
  correctAnswer: z.number().min(0).max(3),
});

type F = z.infer<typeof schema>;

const OPT_BN = ['ক', 'খ', 'গ', 'ঘ'];
const OPT_COLORS = [
  'border-violet-300 bg-violet-50 text-violet-700',
  'border-sky-300 bg-sky-50 text-sky-700',
  'border-amber-300 bg-amber-50 text-amber-700',
  'border-rose-300 bg-rose-50 text-rose-700',
];

interface Props {
  initialData?: MCQStructure;
  onSave: (data: MCQStructure) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function MCQEditor({ initialData, onSave, onCancel, loading }: Props) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: initialData ?? {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  });

  const correctAnswer = watch('correctAnswer');

  return (
    <form onSubmit={handleSubmit(d => onSave(d as MCQStructure))} className="space-y-4 p-4">
      {/* Question */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <p className="text-sm font-semibold text-emerald-800 mb-2">❓ প্রশ্ন</p>
        <Textarea
          {...register('question')}
          placeholder="MCQ প্রশ্ন এখানে লিখুন..."
          rows={3}
          error={errors.question?.message}
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 px-1">
          🔘 বিকল্পসমূহ
          <span className="text-gray-400 font-normal text-xs ml-2">— সঠিক উত্তরে ট্যাপ করুন</span>
        </p>
        <Controller
          name="correctAnswer"
          control={control}
          render={({ field }) => (
            <>
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} className="flex items-center gap-3">
                  {/* Option selector button */}
                  <button
                    type="button"
                    onClick={() => field.onChange(idx)}
                    className={cn(
                      'w-11 h-11 rounded-xl border-2 font-bold text-base flex-shrink-0 transition-all duration-150 active:scale-95',
                      correctAnswer === idx
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                        : OPT_COLORS[idx]
                    )}
                  >
                    {OPT_BN[idx]}
                  </button>
                  <div className="flex-1">
                    <Input
                      {...register(`options.${idx}` as 'options.0' | 'options.1' | 'options.2' | 'options.3')}
                      placeholder={`${OPT_BN[idx]} বিকল্প লিখুন`}
                      error={errors.options?.[idx]?.message}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        />
        {correctAnswer !== undefined && (
          <p className="text-xs text-emerald-600 font-medium px-1 mt-1">
            ✓ সঠিক উত্তর: {OPT_BN[correctAnswer]} বিকল্প
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2 pb-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>বাতিল</Button>
        <Button type="submit" fullWidth loading={loading}>সংরক্ষণ করুন</Button>
      </div>
    </form>
  );
}
