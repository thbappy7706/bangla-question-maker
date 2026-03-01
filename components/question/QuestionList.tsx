"use client";
import { Question, QuestionStructure, QuestionType } from "@/types";
import { useQuestionStore } from "@/store/useQuestionStore";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QuestionCard from "./QuestionCard";
import SrijonshilEditor from "./SrijonshilEditor";
import SongkhiptoEditor from "./SongkhiptoEditor";
import MCQEditor from "./MCQEditor";
import { toast } from "@/components/ui/use-toast";

interface Props {
  setId: string;
  questions: Question[];
}

type Step = "select" | "edit";

const questionTypes: { type: QuestionType; label: string; description: string; icon: string }[] = [
  { type: "srijonshil", label: "সৃজনশীল", description: "উদ্দীপকসহ ক, খ, গ, ঘ প্রশ্ন", icon: "📖" },
  { type: "songkhipto", label: "সংক্ষিপ্ত", description: "সংক্ষিপ্ত প্রশ্ন ও উত্তর", icon: "✏️" },
  { type: "mcq", label: "বহুনির্বাচনী (MCQ)", description: "৪টি বিকল্পসহ MCQ", icon: "🔘" },
];

export default function QuestionList({ setId, questions }: Props) {
  const { addQuestion } = useQuestionStore();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("select");
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSelectType = (type: QuestionType) => {
    setSelectedType(type);
    setStep("edit");
  };

  const handleSave = async (structure: QuestionStructure) => {
    if (!selectedType) return;
    setSaving(true);
    await addQuestion(setId, selectedType, structure);
    setSaving(false);
    setOpen(false);
    setStep("select");
    setSelectedType(null);
    toast({ title: "প্রশ্ন যোগ করা হয়েছে" });
  };

  const handleClose = () => {
    setOpen(false);
    setStep("select");
    setSelectedType(null);
  };

  return (
    <div>
      <div className="space-y-3">
        {questions.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-600">
            <div className="text-5xl mb-3">📝</div>
            <p className="bangla-font text-base">এখনো কোনো প্রশ্ন যোগ করা হয়নি</p>
            <p className="bangla-font text-sm mt-1">নিচের বোতামে ক্লিক করে প্রশ্ন যোগ করুন</p>
          </div>
        )}
        {questions.map((q, idx) => (
          <QuestionCard key={q.id} question={q} index={idx} />
        ))}
      </div>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="bangla-font">
              {step === "select" ? "প্রশ্নের ধরন নির্বাচন করুন" : 
                `নতুন ${questionTypes.find(t => t.type === selectedType)?.label} প্রশ্ন`}
            </DialogTitle>
          </DialogHeader>

          {step === "select" && (
            <div className="grid gap-3 py-2">
              {questionTypes.map(qt => (
                <button
                  key={qt.type}
                  onClick={() => handleSelectType(qt.type)}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                >
                  <span className="text-3xl">{qt.icon}</span>
                  <div>
                    <p className="font-bold bangla-font text-gray-900 dark:text-white">{qt.label}</p>
                    <p className="text-sm text-gray-500 bangla-font">{qt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === "edit" && selectedType === "srijonshil" && (
            <SrijonshilEditor onSave={handleSave} onCancel={() => setStep("select")} loading={saving} />
          )}
          {step === "edit" && selectedType === "songkhipto" && (
            <SongkhiptoEditor onSave={handleSave} onCancel={() => setStep("select")} loading={saving} />
          )}
          {step === "edit" && selectedType === "mcq" && (
            <MCQEditor onSave={handleSave} onCancel={() => setStep("select")} loading={saving} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
