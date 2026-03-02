import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Button, EmptyState, showToast } from '@/components/ui';
import QuestionCard from '@/components/question/QuestionCard';
import AddQuestionFAB from '@/components/question/AddQuestionFAB';
import { ArrowLeft, Download, FileText, Sun, Moon, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useT, useLangStore } from '@/lib/i18n';
import { useThemeStore } from '@/lib/theme';

export default function Editor() {
  const t = useT();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSet, getQuestions } = useStore();
  const { toggleTheme, theme } = useThemeStore();
  const { toggleLang, lang } = useLangStore();
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const qs = getSet(id!);
  const questions = getQuestions(id!);

  if (!qs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
    <div className="min-h-screen bg-gray-50 dark:bg-transparent transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-black/40 dark:backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-sm">
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
      <div className="px-4 py-4 space-y-3 mb-24">
        {questions.length === 0 ? (
          <EmptyState
            icon="➕"
            title={t('editor.emptyTitle')}
            desc={t('editor.emptyDesc')}
          />
        ) : (
          questions.map((q, idx) => (
            <QuestionCard key={q.id} question={q} index={idx} />
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <AddQuestionFAB setId={id!} isMCQOnly={qs.isMCQOnly} />
    </div>
  );
}
