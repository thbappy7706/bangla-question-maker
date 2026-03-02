import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { QuestionSet } from '@/types';
import { Button, Card, BottomSheet, Input, EmptyState, Badge, showToast } from '@/components/ui';
import { Confirm } from '@/components/ui/Confirm';
import { Plus, BookOpen, Trash2, Pencil, ChevronRight, FileText, Clock, Hash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  institution: z.string().optional().default(''),
  examName: z.string().min(1, 'পরীক্ষার নাম দিন'),
  className: z.string().optional().default(''),
  subjectName: z.string().optional().default(''),
  fullMarks: z.union([z.literal(''), z.coerce.number().positive()]).optional(),
  duration: z.union([z.literal(''), z.coerce.number().positive()]).optional(),
  note: z.string().optional().default(''),
});

type F = z.infer<typeof schema>;

function SetForm({ initial, onSave, onCancel }: {
  initial?: Partial<F>;
  onSave: (d: F) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { institution: '', examName: '', className: '', subjectName: '', fullMarks: '', duration: '', note: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-3 p-4">
      <Input label="প্রতিষ্ঠানের নাম" {...register('institution')} placeholder="যেমন: ঢাকা সরকারি বিদ্যালয়" />
      <Input label="পরীক্ষার নাম *" {...register('examName')} placeholder="যেমন: বার্ষিক পরীক্ষা ২০২৫" error={errors.examName?.message} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="শ্রেণি" {...register('className')} placeholder="যেমন: দশম" />
        <Input label="বিষয়" {...register('subjectName')} placeholder="যেমন: বাংলা" />
        <Input label="পূর্ণমান" type="number" {...register('fullMarks')} placeholder="১০০" />
        <Input label="সময় (মিনিট)" type="number" {...register('duration')} placeholder="৩০" />
      </div>
      <Input label="বিশেষ নির্দেশনা" {...register('note')} placeholder="ঐচ্ছিক..." />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>বাতিল</Button>
        <Button type="submit" fullWidth>সংরক্ষণ করুন</Button>
      </div>
    </form>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { sets, questions, createSet, updateSet, deleteSet } = useStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [editSet, setEditSet] = useState<QuestionSet | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const qCount = (id: string) => questions.filter(q => q.setId === id).length;
  const typeCount = (id: string, type: string) => questions.filter(q => q.setId === id && q.type === type).length;

  const handleCreate = (data: F) => {
    const s = createSet(data as Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt'>);
    setCreateOpen(false);
    showToast('প্রশ্নসেট তৈরি হয়েছে ✓');
    navigate(`/editor/${s.id}`);
  };

  const handleUpdate = (data: F) => {
    if (!editSet) return;
    updateSet(editSet.id, data as Partial<QuestionSet>);
    setEditSet(null);
    showToast('আপডেট হয়েছে ✓');
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteSet(deleteId);
    setDeleteId(null);
    showToast('মুছে ফেলা হয়েছে');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">প্রশ্ন মেকার</h1>
              <p className="text-xs text-gray-400">{sets.length}টি প্রশ্নসেট</p>
            </div>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="w-4 h-4" />
            নতুন
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-3 pb-8">
        {sets.length === 0 ? (
          <EmptyState
            icon="📝"
            title="কোনো প্রশ্নসেট নেই"
            desc="নতুন প্রশ্নসেট তৈরি করুন এবং প্রশ্ন যোগ করা শুরু করুন"
            action={
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="w-4 h-4" />
                প্রথম প্রশ্নসেট তৈরি করুন
              </Button>
            }
          />
        ) : (
          sets.map(s => (
            <Card
              key={s.id}
              className="hover-card transition-all duration-150"
              onClick={() => navigate(`/editor/${s.id}`)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                      {s.examName || 'অজানা পরীক্ষা'}
                    </h3>
                    {s.institution && (
                      <p className="text-sm text-gray-500 mt-0.5 truncate">{s.institution}</p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {s.className && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {s.className}
                        </span>
                      )}
                      {s.subjectName && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {s.subjectName}
                        </span>
                      )}
                      {s.fullMarks && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          পূর্ণমান {s.fullMarks}
                        </span>
                      )}
                      {s.duration && (
                        <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                          ⏱ {s.duration} মিনিট
                        </span>
                      )}
                    </div>

                    {/* Question counts */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs font-semibold text-gray-700">মোট {qCount(s.id)}টি প্রশ্ন</span>
                      {typeCount(s.id, 'srijonshil') > 0 && (
                        <Badge variant="srijonshil">{typeCount(s.id, 'srijonshil')} সৃজনশীল</Badge>
                      )}
                      {typeCount(s.id, 'songkhipto') > 0 && (
                        <Badge variant="songkhipto">{typeCount(s.id, 'songkhipto')} সংক্ষিপ্ত</Badge>
                      )}
                      {typeCount(s.id, 'mcq') > 0 && (
                        <Badge variant="mcq">{typeCount(s.id, 'mcq')} MCQ</Badge>
                      )}
                    </div>
                  </div>

                  {/* Arrow + actions */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 ml-1">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <button
                      onClick={e => { e.stopPropagation(); setEditSet(s); }}
                      className="w-8 h-8 rounded-full hover:bg-blue-50 flex items-center justify-center text-blue-400 mt-2"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setDeleteId(s.id); }}
                      className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create sheet */}
      <BottomSheet open={createOpen} onClose={() => setCreateOpen(false)} title="নতুন প্রশ্নসেট তৈরি">
        <SetForm onSave={handleCreate} onCancel={() => setCreateOpen(false)} />
      </BottomSheet>

      {/* Edit sheet */}
      <BottomSheet open={!!editSet} onClose={() => setEditSet(null)} title="প্রশ্নসেট সম্পাদনা">
        {editSet && (
          <SetForm
            initial={{
              institution: editSet.institution,
              examName: editSet.examName,
              className: editSet.className,
              subjectName: editSet.subjectName,
              fullMarks: editSet.fullMarks,
              duration: editSet.duration,
              note: editSet.note,
            }}
            onSave={handleUpdate}
            onCancel={() => setEditSet(null)}
          />
        )}
      </BottomSheet>

      {/* Delete confirm */}
      <Confirm
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="প্রশ্নসেট মুছে ফেলবেন?"
        desc="এই প্রশ্নসেট এবং এর সকল প্রশ্ন স্থায়ীভাবে মুছে যাবে।"
        confirmLabel="মুছুন"
        danger
      />
    </div>
  );
}
