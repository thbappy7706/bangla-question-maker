import { useState } from 'react';
import { Question, SrijonshilStructure, SongkhiptoStructure, MCQStructure, QuestionStructure } from '@/types';
import { useStore } from '@/store';
import { Badge, BottomSheet, Button } from '@/components/ui';
import { Confirm } from '@/components/ui/Confirm';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import SrijonshilEditor from './SrijonshilEditor';
import SongkhiptoEditor from './SongkhiptoEditor';
import MCQEditor from './MCQEditor';
import { showToast } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';

const OPT = ['ক', 'খ', 'গ', 'ঘ'];

interface Props { question: Question; index: number; hideStem?: boolean; }

export default function QuestionCard({ question, index, hideStem }: Props) {
  const t = useT();
  const { updateQuestion, deleteQuestion } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const TYPE_LABELS = { srijonshil: t('qtype.srijonshil'), songkhipto: t('qtype.songkhipto'), mcq: t('qtype.mcq') };
  const EDIT_TITLES = {
    srijonshil: t('edit.srijonshil.edit'),
    songkhipto: t('edit.songkhipto.edit'),
    mcq: t('edit.mcq.edit'),
  };

  const handleSave = async (structure: QuestionStructure) => {
    setSaving(true);
    updateQuestion(question.id, structure);
    setSaving(false);
    setEditOpen(false);
    showToast(t('toast.qUpdated'));
  };

  const handleDelete = () => {
    deleteQuestion(question.id);
    showToast(t('toast.qDeleted'));
  };

  const preview = () => {
    if (question.type === 'srijonshil') {
      const s = question.structure as SrijonshilStructure;
      if (s.uddipok?.trim()) return `${t('card.uddipok')}: ${s.uddipok}`;
      if (s.image) return `🖼️ [${t('card.uddipok')}]`;
      return `ক) ${s.ko.question}`;
    }
    if (question.type === 'songkhipto') {
      const s = question.structure as SongkhiptoStructure;
      return s.question?.trim() || '🖼️ [চিত্র]';
    }
    if (question.type === 'mcq') {
      const s = question.structure as MCQStructure;
      return s.question?.trim() || '🖼️ [চিত্র]';
    }
    return '';
  };

  const borderColors = {
    srijonshil: 'border-l-violet-400 dark:border-l-violet-500',
    songkhipto: 'border-l-sky-400 dark:border-l-sky-500',
    mcq: 'border-l-emerald-400 dark:border-l-emerald-500',
  };

  return (
    <>
      <div className={cn(
        'bg-white rounded-2xl border border-gray-100 shadow-sm border-l-4 overflow-hidden',
        'dark:bg-gray-800 dark:border-gray-700',
        borderColors[question.type]
      )}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Number */}
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant={question.type}>{TYPE_LABELS[question.type]}</Badge>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">{preview()}</p>

              {/* Expanded content */}
              {expanded && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  {question.type === 'srijonshil' && (() => {
                    const s = question.structure as SrijonshilStructure;
                    return (
                      <div className="space-y-2">
                        {(s.uddipok?.trim() || s.image) && (
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-100 dark:border-emerald-800/30">
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">{t('card.uddipok')}</p>
                            {s.uddipok?.trim() && <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap mb-2">{s.uddipok}</p>}
                            {s.image && (
                              <div className="rounded-lg overflow-hidden bg-white dark:bg-black/40 border border-emerald-100 dark:border-emerald-800/30">
                                <img src={s.image} alt="Uddipok" className="w-full h-auto max-h-64 object-contain mx-auto" />
                              </div>
                            )}
                          </div>
                        )}
                        {[['ক', s.ko], ['খ', s.kho], ['গ', s.go], ['ঘ', s.gho]].map(([lbl, part]) => {
                          const p = part as { question: string };
                          return (
                            <div key={lbl as string} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                              <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{lbl as string}) {p.question}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {question.type === 'songkhipto' && (() => {
                    const s = question.structure as SongkhiptoStructure;
                    return (
                      <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-3 border border-sky-100 dark:border-sky-800/30">
                        {s.question?.trim() && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-2">
                            {s.question}
                          </p>
                        )}
                        {s.image && (
                          <div className="rounded-lg overflow-hidden bg-white dark:bg-black/40 border border-sky-100 dark:border-sky-800/30">
                            <img src={s.image} alt="Question" className="w-full h-auto max-h-64 object-contain mx-auto" />
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {question.type === 'mcq' && (() => {
                    const s = question.structure as MCQStructure;
                    const st_labels = ['i', 'ii', 'iii'];
                    return (
                      <div className="space-y-3">
                        {s.mcqType === 'unified' && s.stem && !hideStem && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-900/30">
                            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                              {t('mcq.stem')}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{s.stem}</p>
                          </div>
                        )}

                        {s.mcqType === 'multi' && s.statements && (
                          <div className="space-y-1.5 ml-1 mb-2">
                            {s.statements.map((st, i) => st && (
                              <p key={i} className="text-xs text-gray-700 dark:text-gray-300">
                                <span className="font-bold mr-2">{st_labels[i]}.</span>
                                {st}
                              </p>
                            ))}
                            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-2">
                              নিচের কোনটি সঠিক?
                            </p>
                          </div>
                        )}

                        {s.image && (
                          <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5">
                            <img src={s.image} alt="Question" className="w-full h-auto max-h-64 object-contain mx-auto" />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {s.options.map((opt, i) => (
                            <div key={i} className="rounded-xl p-2.5 text-xs bg-gray-50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-1.5">{OPT[i]})</span>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setExpanded(e => !e)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setEditOpen(true)}
                className="w-8 h-8 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-8 h-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit sheet */}
      <BottomSheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={EDIT_TITLES[question.type]}
      >
        {question.type === 'srijonshil' && (
          <SrijonshilEditor
            initialData={question.structure as SrijonshilStructure}
            onSave={handleSave}
            onCancel={() => setEditOpen(false)}
            loading={saving}
          />
        )}
        {question.type === 'songkhipto' && (
          <SongkhiptoEditor
            initialData={question.structure as SongkhiptoStructure}
            onSave={handleSave}
            onCancel={() => setEditOpen(false)}
            loading={saving}
          />
        )}
        {question.type === 'mcq' && (
          <MCQEditor
            initialData={question.structure as MCQStructure}
            onSave={handleSave}
            onCancel={() => setEditOpen(false)}
            loading={saving}
          />
        )}
      </BottomSheet>

      {/* Delete confirm */}
      <Confirm
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title={t('confirm.deleteQ.title')}
        desc={t('confirm.deleteQ.desc')}
        confirmLabel={t('confirm.deleteQ.btn')}
        cancelLabel={t('confirm.cancel')}
        danger
      />
    </>
  );
}
