"use client";
import { useState } from "react";
import { Question, SrijonshilStructure, SongkhiptoStructure, MCQStructure, QuestionStructure } from "@/types";
import { useQuestionStore } from "@/store/useQuestionStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import SrijonshilEditor from "./SrijonshilEditor";
import SongkhiptoEditor from "./SongkhiptoEditor";
import MCQEditor from "./MCQEditor";
import { toast } from "@/components/ui/use-toast";

interface Props {
  question: Question;
  index: number;
}

const optionLabels = ["ক", "খ", "গ", "ঘ"];
const typeLabels: Record<string, string> = {
  srijonshil: "সৃজনশীল",
  songkhipto: "সংক্ষিপ্ত",
  mcq: "বহুনির্বাচনী",
};

export default function QuestionCard({ question, index }: Props) {
  const { updateQuestion, deleteQuestion } = useQuestionStore();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSave = async (structure: QuestionStructure) => {
    setSaving(true);
    await updateQuestion(question.id, structure);
    setSaving(false);
    setEditing(false);
    toast({ title: "প্রশ্ন আপডেট হয়েছে" });
  };

  const handleDelete = async () => {
    setDeleting(true);
    await deleteQuestion(question.id);
    toast({ title: "প্রশ্ন মুছে ফেলা হয়েছে" });
  };

  const getPreview = () => {
    if (question.type === "srijonshil") {
      const s = question.structure as SrijonshilStructure;
      return s.uddipok ? `উদ্দীপক: ${s.uddipok.substring(0, 80)}...` : `ক) ${s.ko.question.substring(0, 80)}`;
    }
    if (question.type === "songkhipto") {
      const s = question.structure as SongkhiptoStructure;
      return s.question.substring(0, 100);
    }
    if (question.type === "mcq") {
      const s = question.structure as MCQStructure;
      return s.question.substring(0, 100);
    }
    return "";
  };

  const typeColors: Record<string, string> = {
    srijonshil: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    songkhipto: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    mcq: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  };

  return (
    <>
      <div className="border border-border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bangla-font ${typeColors[question.type]}`}>
                  {typeLabels[question.type]}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 bangla-font line-clamp-2 leading-relaxed">
                {getPreview()}
              </p>

              {expanded && question.type === "srijonshil" && (
                <div className="mt-3 space-y-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  {["ko", "kho", "go", "gho"].map((k, i) => {
                    const s = question.structure as SrijonshilStructure;
                    const part = s[k as keyof Pick<SrijonshilStructure, "ko"|"kho"|"go"|"gho">];
                    const labels = ["ক", "খ", "গ", "ঘ"];
                    return (
                      <div key={k}>
                        <p className="text-xs font-semibold bangla-font text-blue-600">{labels[i]}) {part.question}</p>
                        {part.answer && <p className="text-xs text-gray-500 bangla-font mt-0.5">উত্তর: {part.answer}</p>}
                      </div>
                    );
                  })}
                </div>
              )}

              {expanded && question.type === "mcq" && (
                <div className="mt-3 space-y-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  {(question.structure as MCQStructure).options.map((opt, i) => (
                    <p key={i} className={`text-xs bangla-font ${i === (question.structure as MCQStructure).correctAnswer ? "text-green-600 font-semibold" : "text-gray-600 dark:text-gray-400"}`}>
                      {optionLabels[i]}) {opt} {i === (question.structure as MCQStructure).correctAnswer ? "✓" : ""}
                    </p>
                  ))}
                </div>
              )}

              {expanded && question.type === "songkhipto" && (
                <div className="mt-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 bangla-font">উত্তর: {(question.structure as SongkhiptoStructure).answer}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="bangla-font">প্রশ্ন সম্পাদনা - {typeLabels[question.type]}</DialogTitle>
          </DialogHeader>
          {question.type === "srijonshil" && (
            <SrijonshilEditor
              initialData={question.structure as SrijonshilStructure}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
              loading={saving}
            />
          )}
          {question.type === "songkhipto" && (
            <SongkhiptoEditor
              initialData={question.structure as SongkhiptoStructure}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
              loading={saving}
            />
          )}
          {question.type === "mcq" && (
            <MCQEditor
              initialData={question.structure as MCQStructure}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
              loading={saving}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
