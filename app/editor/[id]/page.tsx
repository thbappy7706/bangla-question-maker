"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useQuestionStore } from "@/store/useQuestionStore";
import Navbar from "@/components/layout/Navbar";
import QuestionList from "@/components/question/QuestionList";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { sets, questions, fetchSets, fetchQuestions, setCurrentSet, currentSet } = useQuestionStore();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth"); return; }
      if (sets.length === 0) await fetchSets();
      await fetchQuestions(id);
      setLoading(false);
    };
    init();
  }, [id, router, fetchSets, fetchQuestions, sets.length]);

  useEffect(() => {
    const found = sets.find(s => s.id === id);
    if (found) setCurrentSet(found);
  }, [sets, id, setCurrentSet]);

  const handleExportPDF = async () => {
    if (!currentSet) return;
    setExporting(true);
    try {
      const { exportToPDF } = await import("@/lib/export/pdf");
      await exportToPDF(currentSet, questions);
      toast({ title: "PDF ডাউনলোড হয়েছে" });
    } catch (e) {
      toast({ title: "PDF রপ্তানি ব্যর্থ", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const handleExportDocx = async () => {
    if (!currentSet) return;
    setExporting(true);
    try {
      const { exportToDocx } = await import("@/lib/export/docx");
      await exportToDocx(currentSet, questions);
      toast({ title: "Word ডকুমেন্ট ডাউনলোড হয়েছে" });
    } catch (e) {
      toast({ title: "Word রপ্তানি ব্যর্থ", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const typeCount = {
    srijonshil: questions.filter(q => q.type === "srijonshil").length,
    songkhipto: questions.filter(q => q.type === "songkhipto").length,
    mcq: questions.filter(q => q.type === "mcq").length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3">⏳</div>
        <p className="bangla-font text-gray-500">লোড হচ্ছে...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors bangla-font text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            ড্যাশবোর্ড
          </button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDocx}
              disabled={exporting || questions.length === 0}
              className="bangla-font gap-1 text-xs"
            >
              <FileText className="w-3 h-3" />
              Word
            </Button>
            <Button
              size="sm"
              onClick={handleExportPDF}
              disabled={exporting || questions.length === 0}
              className="bangla-font gap-1 text-xs"
            >
              <Download className="w-3 h-3" />
              PDF
            </Button>
          </div>
        </div>

        {/* Header Card */}
        {currentSet && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-5 mb-6">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-xl font-bold bangla-font text-gray-900 dark:text-white">
                  {currentSet.exam_name || "অজানা পরীক্ষা"}
                </h1>
                {currentSet.institution && (
                  <p className="text-sm text-gray-500 bangla-font mt-1">{currentSet.institution}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentSet.class_name && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded bangla-font">
                      শ্রেণি: {currentSet.class_name}
                    </span>
                  )}
                  {currentSet.subject_name && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded bangla-font">
                      {currentSet.subject_name}
                    </span>
                  )}
                  {currentSet.full_marks && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 px-2 py-1 rounded bangla-font">
                      পূর্ণমান: {currentSet.full_marks}
                    </span>
                  )}
                  {currentSet.duration && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 px-2 py-1 rounded bangla-font">
                      সময়: {currentSet.duration} মিনিট
                    </span>
                  )}
                </div>
                {currentSet.note && (
                  <p className="text-xs text-gray-400 bangla-font mt-2 italic">{currentSet.note}</p>
                )}
              </div>
              <div className="flex gap-3 text-center">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg px-3 py-2">
                  <div className="text-lg font-bold text-purple-600">{typeCount.srijonshil}</div>
                  <div className="text-xs text-purple-500 bangla-font">সৃজনশীল</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                  <div className="text-lg font-bold text-blue-600">{typeCount.songkhipto}</div>
                  <div className="text-xs text-blue-500 bangla-font">সংক্ষিপ্ত</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                  <div className="text-lg font-bold text-green-600">{typeCount.mcq}</div>
                  <div className="text-xs text-green-500 bangla-font">MCQ</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions */}
        <div>
          <h2 className="text-base font-semibold bangla-font text-gray-700 dark:text-gray-300 mb-3">
            প্রশ্নসমূহ ({questions.length}টি)
          </h2>
          <QuestionList setId={id} questions={questions} />
        </div>
      </main>
    </div>
  );
}
