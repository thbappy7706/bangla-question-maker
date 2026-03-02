import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { Button, EmptyState, showToast } from '@/components/ui';
import QuestionCard from '@/components/question/QuestionCard';
import AddQuestionFAB from '@/components/question/AddQuestionFAB';
import { ArrowLeft, Download, FileText, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSet, getQuestions } = useStore();
  const [exporting, setExporting] = useState<'pdf' | 'docx' | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const qs = getSet(id!);
  const questions = getQuestions(id!);

  if (!qs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <EmptyState
          icon="🔍"
          title="প্রশ্নসেট পাওয়া যায়নি"
          action={<Button onClick={() => navigate('/')}>ড্যাশবোর্ডে যান</Button>}
        />
      </div>
    );
  }

  const handlePDF = async () => {
    setExporting('pdf');
    setExportMenuOpen(false);
    try {
      const { exportToPDF } = await import('@/lib/export/pdf');
      await exportToPDF(qs, questions);
      showToast('PDF ডাউনলোড হয়েছে ✓');
    } catch {
      showToast('PDF তৈরিতে সমস্যা হয়েছে', 'error');
    } finally {
      setExporting(null);
    }
  };

  const handleDocx = async () => {
    setExporting('docx');
    setExportMenuOpen(false);
    try {
      const { exportToDocx } = await import('@/lib/export/docx');
      await exportToDocx(qs, questions);
      showToast('Word ফাইল ডাউনলোড হয়েছে ✓');
    } catch {
      showToast('Word ফাইল তৈরিতে সমস্যা হয়েছে', 'error');
    } finally {
      setExporting(null);
    }
  };

  const typeCount = (type: string) => questions.filter(q => q.type === type).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-3 h-14"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0 active:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 text-sm leading-tight truncate">{qs.examName}</h1>
            <p className="text-xs text-gray-400 truncate">
              {[qs.institution, qs.className, qs.subjectName].filter(Boolean).join(' • ') || 'প্রশ্নপত্র'}
            </p>
          </div>

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
              রপ্তানি
            </Button>

            {exportMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setExportMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 w-48 animate-pop-in">
                  <button
                    onClick={handlePDF}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    PDF ডাউনলোড
                  </button>
                  <div className="h-px bg-gray-100" />
                  <button
                    onClick={handleDocx}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    Word (.docx)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap flex-shrink-0">
            মোট {questions.length}টি
          </span>
          {[
            { type: 'srijonshil', label: 'সৃজনশীল', color: 'bg-violet-100 text-violet-700' },
            { type: 'songkhipto', label: 'সংক্ষিপ্ত', color: 'bg-sky-100 text-sky-700' },
            { type: 'mcq', label: 'MCQ', color: 'bg-emerald-100 text-emerald-700' },
          ].map(t => typeCount(t.type) > 0 && (
            <span key={t.type} className={cn('text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0', t.color)}>
              {typeCount(t.type)} {t.label}
            </span>
          ))}
          {qs.fullMarks && (
            <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 ml-auto">
              পূর্ণমান: {qs.fullMarks}
            </span>
          )}
        </div>
      </div>

      {/* Questions list */}
      <div className="px-4 py-4 space-y-3 mb-24">
        {questions.length === 0 ? (
          <EmptyState
            icon="➕"
            title="কোনো প্রশ্ন নেই"
            desc="নিচের সবুজ বোতামে ট্যাপ করে প্রশ্ন যোগ করুন"
          />
        ) : (
          questions.map((q, idx) => (
            <QuestionCard key={q.id} question={q} index={idx} />
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <AddQuestionFAB setId={id!} />
    </div>
  );
}
