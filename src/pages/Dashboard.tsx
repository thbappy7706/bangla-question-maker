import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { QuestionSet } from '@/types';
import { Button, Card, BottomSheet, Input, EmptyState, Badge, showToast } from '@/components/ui';
import { Confirm } from '@/components/ui/Confirm';
import { Plus, BookOpen, Trash2, Pencil, ChevronRight, FileText, Sun, Moon, Languages } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useT, useLangStore } from '@/lib/i18n';
import { useThemeStore } from '@/lib/theme';

function SetForm({ initial, onSave, onCancel }: {
  initial?: Partial<any>;
  onSave: (d: any) => void;
  onCancel: () => void;
}) {
  const t = useT();
  const schema = z.object({
    institution: z.string().optional().default(''),
    examName: z.string().min(1, t('setForm.examNameErr')),
    className: z.string().optional().default(''),
    subjectName: z.string().optional().default(''),
    fullMarks: z.union([z.literal(''), z.coerce.number().positive()]).optional(),
    duration: z.union([z.literal(''), z.coerce.number().positive()]).optional(),
    note: z.string().optional().default(''),
  });
  type F = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { institution: '', examName: '', className: '', subjectName: '', fullMarks: '', duration: '', note: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-3 p-4">
      <Input label={t('setForm.institution')} {...register('institution')} placeholder={t('setForm.institutionPh')} />
      <Input label={t('setForm.examName')} {...register('examName')} placeholder={t('setForm.examNamePh')} error={errors.examName?.message} />
      <div className="grid grid-cols-2 gap-3">
        <Input label={t('setForm.class')} {...register('className')} placeholder={t('setForm.classPh')} />
        <Input label={t('setForm.subject')} {...register('subjectName')} placeholder={t('setForm.subjectPh')} />
        <Input label={t('setForm.fullMarks')} type="number" {...register('fullMarks')} placeholder={t('setForm.fullMarksPh')} />
        <Input label={t('setForm.duration')} type="number" {...register('duration')} placeholder={t('setForm.durationPh')} />
      </div>
      <Input label={t('setForm.note')} {...register('note')} placeholder={t('setForm.notePh')} />
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>{t('setForm.cancel')}</Button>
        <Button type="submit" fullWidth>{t('setForm.save')}</Button>
      </div>
    </form>
  );
}

export default function Dashboard() {
  const t = useT();
  const navigate = useNavigate();
  const { sets, questions, createSet, updateSet, deleteSet } = useStore();
  const { toggleTheme, theme } = useThemeStore();
  const { toggleLang, lang } = useLangStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [editSet, setEditSet] = useState<QuestionSet | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createType, setCreateType] = useState<'normal' | 'mcq'>('normal');

  const qCount = (id: string) => questions.filter(q => q.setId === id).length;
  const typeCount = (id: string, type: string) => questions.filter(q => q.setId === id && q.type === type).length;

  const handleCreate = (data: any) => {
    const s = createSet({
      ...(data as Omit<QuestionSet, 'id' | 'createdAt' | 'updatedAt' | 'isMCQOnly'>),
      isMCQOnly: createType === 'mcq'
    });
    setCreateOpen(false);
    showToast(t('toast.setCreated'));
    navigate(`/editor/${s.id}`);
  };

  const handleUpdate = (data: any) => {
    if (!editSet) return;
    updateSet(editSet.id, data as Partial<QuestionSet>);
    setEditSet(null);
    showToast(t('toast.setUpdated'));
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteSet(deleteId);
    setDeleteId(null);
    showToast(t('toast.setDeleted'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-black/40 dark:backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight">{t('app.title')}</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('app.setCount', sets.length)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="w-8 h-8 min-w-[32px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
              title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            >
              <span className="text-xs font-bold">{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 min-w-[32px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Button onClick={() => { setCreateType('normal'); setCreateOpen(true); }} size="sm" className="whitespace-nowrap px-4 font-bold shadow-md shadow-emerald-900/10">
              <Plus className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
              {t('app.new')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4 pb-8 max-w-2xl mx-auto">
        {sets.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center min-h-[60vh]">
            <EmptyState
              icon="📝"
              title={t('dashboard.empty.title')}
              desc={t('dashboard.empty.desc')}
              action={
                <div className="flex flex-row items-center justify-center gap-3">
                  <Button onClick={() => { setCreateType('normal'); setCreateOpen(true); }} className="px-5 shadow-lg shadow-emerald-900/10">
                    <Plus className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
                    {t('dashboard.empty.action')}
                  </Button>
                  <Button
                    onClick={() => { setCreateType('mcq'); setCreateOpen(true); }}
                    className="px-5 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-lg shadow-emerald-900/10"
                  >
                    <Plus className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
                    {t('app.newMCQ')}
                  </Button>
                </div>
              }
            />
          </div>
        ) : (
          sets.map(s => (
            <Card
              key={s.id}
              className="hover-card transition-all duration-150"
              onClick={() => navigate(`/editor/${s.id}`)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight truncate">
                      {s.examName || t('dashboard.unknownExam')}
                    </h3>
                    {s.institution && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{s.institution}</p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {s.className && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                          {s.className}
                        </span>
                      )}
                      {s.subjectName && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                          {s.subjectName}
                        </span>
                      )}
                      {s.fullMarks && (
                        <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
                          {t('dashboard.fullMarks', s.fullMarks)}
                        </span>
                      )}
                      {s.duration && (
                        <span className="text-xs bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full">
                          {t('dashboard.duration', s.duration)}
                        </span>
                      )}
                    </div>

                    {/* Question counts */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('dashboard.totalQ', qCount(s.id))}</span>
                      {typeCount(s.id, 'srijonshil') > 0 && (
                        <Badge variant="srijonshil">{typeCount(s.id, 'srijonshil')} {t('qtype.srijonshil')}</Badge>
                      )}
                      {typeCount(s.id, 'songkhipto') > 0 && (
                        <Badge variant="songkhipto">{typeCount(s.id, 'songkhipto')} {t('qtype.songkhipto')}</Badge>
                      )}
                      {typeCount(s.id, 'mcq') > 0 && (
                        <Badge variant="mcq">{typeCount(s.id, 'mcq')} MCQ</Badge>
                      )}
                    </div>
                  </div>

                  {/* Arrow + actions */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 ml-1">
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                    <button
                      onClick={e => { e.stopPropagation(); setEditSet(s); }}
                      className="w-8 h-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center text-blue-400 mt-2"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setDeleteId(s.id); }}
                      className="w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center text-red-400"
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
      <BottomSheet open={createOpen} onClose={() => setCreateOpen(false)} title={t('setForm.createTitle')}>
        <SetForm onSave={handleCreate} onCancel={() => setCreateOpen(false)} />
      </BottomSheet>

      {/* Edit sheet */}
      <BottomSheet open={!!editSet} onClose={() => setEditSet(null)} title={t('setForm.editTitle')}>
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
        title={t('confirm.deleteSet.title')}
        desc={t('confirm.deleteSet.desc')}
        confirmLabel={t('confirm.deleteSet.btn')}
        cancelLabel={t('confirm.cancel')}
        danger
      />
    </div>
  );
}
