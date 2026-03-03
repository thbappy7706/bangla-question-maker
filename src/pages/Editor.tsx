import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Question, MCQStructure } from '@/types';
import { Button, EmptyState, showToast } from '@/components/ui';
import QuestionCard from '@/components/question/QuestionCard';
import AddQuestionFAB from '@/components/question/AddQuestionFAB';
import { ArrowLeft, Download, FileText, Sun, Moon, Languages, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useT, useLangStore } from '@/lib/i18n';
import { useThemeStore } from '@/lib/theme';

export default function Editor() {
  const t = useT();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qs = useStore(state => state.sets.find(s => s.id === id));
  const allQuestions = useStore(state => state.questions);
  const questions = useMemo(() =>
    allQuestions
      .filter(q => q.setId === id)
      .sort((a, b) => a.orderNumber - b.orderNumber),
    [allQuestions, id]
  );
  const { toggleTheme, theme } = useThemeStore();
  const { toggleLang, lang } = useLangStore();
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  if (!id || !qs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
        <EmptyState
          icon="🔍"
          title={t('editor.notFound')}
          action={<Button onClick={() => navigate('/')}>{t('editor.goBack')}</Button>}
        />
      </div>
    );
  }

  const handlePDF = async () => {
    setExporting('pdf');
    setExportMenuOpen(false);
    try {
      const { exportToPDF } = await import('@/lib/export/pdf');
      await exportToPDF(qs, questions, lang);
      showToast(t('toast.pdfDone'));
    } catch {
      showToast(t('toast.pdfErr'), 'error');
    } finally {
      setExporting(null);
    }
  };

  const handleDocx = async () => {
    setExporting('docx');
    setExportMenuOpen(false);
    try {
      const { exportToDocx } = await import('@/lib/export/docx');
      await exportToDocx(qs, questions, lang);
      showToast(t('toast.docxDone'));
    } catch {
      showToast(t('toast.docxErr'), 'error');
    } finally {
      setExporting(null);
    }
  };

  const typeCount = (type: string) => questions.filter(q => q.type === type).length;

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/20 dark:bg-black/40 backdrop-blur-md border-b border-gray-100/20 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-2 px-3 h-14"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0 active:bg-gray-200 dark:active:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight truncate">{qs.examName}</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
              {[qs.institution, qs.className, qs.subjectName].filter(Boolean).join(' • ') || t('editor.questionPaper')}
            </p>
          </div>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0"
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            <span className="text-xs font-bold">{lang === 'bn' ? 'EN' : 'বাং'}</span>
          </button>
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0"
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Export button */}
          <div className="relative flex-shrink-0">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setExportMenuOpen(o => !o)}
              disabled={questions.length === 0 || !!exporting}
              loading={!!exporting}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>

            {exportMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 w-48 animate-pop-in">
                  <button
                    onClick={handlePDF}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    {t('editor.pdfDownload')}
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-gray-700" />
                  <button
                    onClick={handleDocx}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    {t('editor.wordDownload')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white dark:bg-black/20 dark:backdrop-blur-sm border-b border-gray-100 dark:border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
            {t('editor.total', questions.length)}
          </span>
          {[
            { type: 'srijonshil', label: t('qtype.srijonshil'), color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
            { type: 'songkhipto', label: t('qtype.songkhipto'), color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
            { type: 'mcq', label: 'MCQ', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
          ].map(tp => typeCount(tp.type) > 0 && (
            <span key={tp.type} className={cn('text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0', tp.color)}>
              {typeCount(tp.type)} {tp.label}
            </span>
          ))}
          {qs.fullMarks && (
            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0 ml-auto">
              {t('editor.fullMarks', qs.fullMarks)}
            </span>
          )}
        </div>
      </div>

      {/* Questions list */}
      <div className="px-4 py-4 space-y-4 mb-24">
        {questions.length === 0 ? (
          <EmptyState
            icon="➕"
            title={t('editor.emptyTitle')}
            desc={t('editor.emptyDesc')}
          />
        ) : (() => {
          const rendered: any[] = [];
          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const struct = q.structure as MCQStructure;

            // Unified MCQ grouping logic
            if (q.type === 'mcq' && struct.mcqType === 'unified' && struct.stem) {
              const stem = struct.stem;
              const group = [q];
              let j = i + 1;
              while (j < questions.length) {
                const nextQ = questions[j];
                const nextStruct = nextQ.structure as MCQStructure;
                if (nextQ.type === 'mcq' && nextStruct.mcqType === 'unified' && nextStruct.stem === stem) {
                  group.push(nextQ);
                  j++;
                } else break;
              }

              const conjunction = lang === 'bn' ? ' ও ' : ' and ';
              const range = group.length > 1
                ? `${i + 1}${conjunction}${i + group.length}`
                : `${i + 1}`;

              rendered.push(
                <div key={`group-${i}`} className="space-y-3 bg-gray-50/50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-4">
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/30">
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                      <span className="text-sm">📖</span> {t('mcq.stem')}
                    </p>
                    {!stem.includes('নিচের তথ্যের আলোকে') && !stem.includes('Based on the information') && (
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1 leading-relaxed">
                        {t('mcq.unifiedInstruction', range)}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{stem}</p>
                  </div>
                  <div className="space-y-3">
                    {group.map((gq, gidx) => (
                      <QuestionCard
                        key={gq.id}
                        question={gq}
                        index={i + gidx}
                        hideStem
                      />
                    ))}
                  </div>
                </div>
              );
              i = j - 1; // Advance main loop
            } else {
              rendered.push(<QuestionCard key={q.id} question={q} index={i} />);
            }
          }
          return rendered;
        })()}
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

      {/* Floating Add Button */}
      <AddQuestionFAB setId={id!} isMCQOnly={qs.isMCQOnly} />
    </div>
  );
}
