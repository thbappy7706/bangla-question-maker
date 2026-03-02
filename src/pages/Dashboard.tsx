import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { QuestionSet } from '@/types';
import { Button, Card, BottomSheet, Input, EmptyState, Badge, showToast } from '@/components/ui';
import { Confirm } from '@/components/ui/Confirm';
import { Plus, BookOpen, Trash2, Pencil, ChevronRight, FileText, Sun, Moon, Languages, Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useT, useLangStore } from '@/lib/i18n';
import { useThemeStore } from '@/lib/theme';
import { cn } from '@/lib/utils';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
  const [typeSelectOpen, setTypeSelectOpen] = useState(false);

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
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/20 dark:bg-black/40 backdrop-blur-md border-b border-gray-100/20 dark:border-white/10 shadow-sm">
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4 pb-24 max-w-2xl mx-auto">
        {sets.length === 0 ? (
          // ─── LANDING HERO (No sets yet) ────────────────────────────
          <div className="flex flex-col items-center text-center space-y-6 pt-6 pb-2">

            {/* Brand Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-600/30 animate-pop-in">
              <BookOpen className="w-10 h-10 text-white" strokeWidth={1.8} />
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {lang === 'bn' ? 'প্রফেশনাল প্রশ্নপত্র তৈরি করুন' : 'Create Professional Question Papers'}
              </h2>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                {lang === 'bn'
                  ? 'সৃজনশীল, সংক্ষিপ্ত ও MCQ — সব ধরনের প্রশ্নপত্র মিনিটেই তৈরি করুন। PDF ও Word-এ সেভ করুন।'
                  : 'Craft Srijonshil, Short & MCQ question papers in minutes. Export to PDF or Word instantly.'}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { icon: '📖', label: lang === 'bn' ? 'সৃজনশীল প্রশ্ন' : 'Srijonshil' },
                { icon: '✏️', label: lang === 'bn' ? 'সংক্ষিপ্ত প্রশ্ন' : 'Short Q&A' },
                { icon: '🔘', label: 'MCQ' },
                { icon: '📄', label: 'PDF' },
                { icon: '📝', label: 'Word (.docx)' },
                { icon: '📱', label: 'PWA Offline' },
              ].map(f => (
                <span key={f.label} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/10 border border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 backdrop-blur-sm">
                  {f.icon} {f.label}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => setTypeSelectOpen(true)}
              size="lg"
              className="px-8 py-4 rounded-2xl text-base font-bold shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
              {t('dashboard.empty.action')}
            </Button>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-4 text-left">
              {[
                {
                  icon: '✨',
                  title: lang === 'bn' ? 'সহজ ইন্টারফেস' : 'Simple Interface',
                  desc: lang === 'bn' ? 'কয়েকটি ট্যাপেই সম্পূর্ণ প্রশ্নপত্র তৈরি।' : 'Create a full paper in just a few taps.',
                  bg: 'bg-violet-50/80 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800/40',
                },
                {
                  icon: '📤',
                  title: lang === 'bn' ? 'এক ক্লিকে এক্সপোর্ট' : 'One-click Export',
                  desc: lang === 'bn' ? 'PDF ও Word ফাইল সরাসরি ডাউনলোড।' : 'Download PDF or Word files instantly.',
                  bg: 'bg-sky-50/80 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800/40',
                },
                {
                  icon: '📲',
                  title: lang === 'bn' ? 'অফলাইনে কাজ করে' : 'Works Offline',
                  desc: lang === 'bn' ? 'ইন্টারনেট ছাড়াও সম্পূর্ণভাবে ব্যবহারযোগ্য।' : 'Fully functional without internet.',
                  bg: 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/40',
                },
              ].map(card => (
                <div key={card.title} className={`rounded-2xl border p-4 backdrop-blur-sm ${card.bg} transition-all hover:-translate-y-0.5 duration-200`}>
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{card.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ─── COMPACT HERO STRIP (when sets exist) ─────────────── */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-100/50 dark:border-emerald-800/30 p-5 flex items-center gap-4 backdrop-blur-sm mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  {lang === 'bn' ? 'স্বাগতম, QuestionCraft-এ!' : 'Welcome to QuestionCraft!'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {lang === 'bn'
                    ? `আপনার ${sets.length}টি প্রশ্নসেট আছে। নতুন তৈরি করতে + চাপুন।`
                    : `You have ${sets.length} question set${sets.length !== 1 ? 's' : ''}. Tap + to create more.`}
                </p>
              </div>
            </div>

            {sets.map(s => (
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
            ))}
          </>
        )}
      </div>

      {/* Footer - Bottom Right */}
      <footer className="fixed bottom-4 right-5 sm:right-8 z-30 pointer-events-none">
        <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1 bg-white/50 dark:bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100 dark:border-white/5 pointer-events-auto shadow-sm">
          <span>Developed with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
          <span>by</span>
          <a
            href="https://thbappy7706.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-500 font-bold hover:underline transition-all"
          >
            Tanvir Hossen Bappy
          </a>
        </p>
      </footer>

      {/* Floating Action Button for Dashboard */}
      {sets.length > 0 && (
        <button
          onClick={() => setTypeSelectOpen(true)}
          className={cn(
            'fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full shadow-xl',
            'flex items-center justify-center transition-all duration-200 active:scale-95',
            'bg-emerald-600 text-white shadow-emerald-300 dark:shadow-emerald-900/50'
          )}
          style={{ bottom: 'calc(24px + env(safe-area-inset-bottom))' }}
          aria-label={t('app.new')}
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>
      )}

      {/* Set Type Selector */}
      <BottomSheet open={typeSelectOpen} onClose={() => setTypeSelectOpen(false)} title={t('fab.selectType')}>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => { setCreateType('normal'); setTypeSelectOpen(false); setCreateOpen(true); }}
            className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-blue-500/50 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-500 transition-all active:scale-95 group"
          >
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/40 transition-transform group-hover:scale-110">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-blue-700 dark:text-blue-400 text-center">
              {lang === 'bn' ? 'নতুন ' : 'New '}{t('app.new')}
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-500/80 mt-1 text-center">{t('fab.srijonshilDesc')}</span>
          </button>

          <button
            onClick={() => { setCreateType('mcq'); setTypeSelectOpen(false); setCreateOpen(true); }}
            className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:border-emerald-500 transition-all active:scale-95 group"
          >
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/40 transition-transform group-hover:scale-110">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-center">
              {lang === 'bn' ? 'নতুন ' : 'New '}{t('app.newMCQ')}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-500/80 mt-1 text-center">{t('fab.mcqDesc')}</span>
          </button>
        </div>
      </BottomSheet>

      {/* Create sheet */}
      <BottomSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t('setForm.createTitle', t(createType === 'mcq' ? 'app.newMCQ' : 'app.new'))}
      >
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
