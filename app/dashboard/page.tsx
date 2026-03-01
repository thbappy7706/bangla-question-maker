"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useQuestionStore } from "@/store/useQuestionStore";
import Navbar from "@/components/layout/Navbar";
import { QuestionSet } from "@/types";
import { Plus, BookOpen, Trash2, Pencil, Calendar, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { sets, fetchSets, createSet, deleteSet, updateSet } = useQuestionStore();
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editSet, setEditSet] = useState<QuestionSet | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    institution: "", exam_name: "", class_name: "", subject_name: "",
    full_marks: "", duration: "", note: "",
  });

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/auth"); return; }
      await fetchSets();
      setLoading(false);
    };
    check();
  }, [router, fetchSets]);

  const resetForm = () => setFormData({ institution: "", exam_name: "", class_name: "", subject_name: "", full_marks: "", duration: "", note: "" });

  const handleCreate = async () => {
    setSaving(true);
    const result = await createSet({
      ...formData,
      full_marks: formData.full_marks ? parseInt(formData.full_marks) : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
    });
    setSaving(false);
    if (result) {
      setCreateOpen(false);
      resetForm();
      toast({ title: "প্রশ্নসেট তৈরি হয়েছে" });
      router.push(`/editor?id=${result.id}`);
    }
  };

  const handleUpdate = async () => {
    if (!editSet) return;
    setSaving(true);
    await updateSet(editSet.id, {
      ...formData,
      full_marks: formData.full_marks ? parseInt(formData.full_marks) : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
    });
    setSaving(false);
    setEditSet(null);
    resetForm();
    toast({ title: "আপডেট হয়েছে" });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("এই প্রশ্নসেট মুছে ফেলবেন?")) {
      await deleteSet(id);
      toast({ title: "মুছে ফেলা হয়েছে" });
    }
  };

  const openEdit = (s: QuestionSet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSet(s);
    setFormData({
      institution: s.institution || "", exam_name: s.exam_name || "",
      class_name: s.class_name || "", subject_name: s.subject_name || "",
      full_marks: s.full_marks?.toString() || "", duration: s.duration?.toString() || "",
      note: s.note || "",
    });
  };

  const FormFields = () => (
    <div className="grid grid-cols-2 gap-3">
      {[
        { id: "institution", label: "প্রতিষ্ঠানের নাম", full: true },
        { id: "exam_name", label: "পরীক্ষার নাম", full: true },
        { id: "class_name", label: "শ্রেণি" },
        { id: "subject_name", label: "বিষয়" },
        { id: "full_marks", label: "পূর্ণমান", type: "number" },
        { id: "duration", label: "সময় (মিনিট)", type: "number" },
      ].map(field => (
        <div key={field.id} className={field.full ? "col-span-2" : ""}>
          <Label className="bangla-font text-xs">{field.label}</Label>
          <Input
            type={field.type || "text"}
            value={formData[field.id as keyof typeof formData]}
            onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
            className="mt-1 bangla-font"
          />
        </div>
      ))}
      <div className="col-span-2">
        <Label className="bangla-font text-xs">নোট</Label>
        <Textarea
          value={formData.note}
          onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
          className="mt-1 bangla-font min-h-[60px]"
        />
      </div>
    </div>
  );

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
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold bangla-font text-gray-900 dark:text-white">আমার প্রশ্নসেট</h1>
            <p className="text-sm text-gray-500 bangla-font mt-1">আপনার সকল প্রশ্নপত্র এখানে পাবেন</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="bangla-font gap-2">
            <Plus className="w-4 h-4" />
            নতুন প্রশ্নসেট
          </Button>
        </div>

        {sets.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold bangla-font text-gray-500 mb-2">কোনো প্রশ্নসেট নেই</h3>
            <p className="text-gray-400 bangla-font text-sm mb-4">নতুন প্রশ্নসেট তৈরি করুন</p>
            <Button onClick={() => setCreateOpen(true)} className="bangla-font gap-2">
              <Plus className="w-4 h-4" />
              নতুন প্রশ্নসেট
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sets.map(s => (
              <div
                key={s.id}
                onClick={() => router.push(`/editor?id=${s.id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-border hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => openEdit(s, e)} className="p-1.5 rounded hover:bg-blue-50 text-blue-500">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={e => handleDelete(s.id, e)} className="p-1.5 rounded hover:bg-red-50 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold bangla-font text-gray-900 dark:text-white line-clamp-1">
                    {s.exam_name || "অজানা পরীক্ষা"}
                  </h3>
                  <p className="text-sm text-gray-500 bangla-font mt-1 line-clamp-1">{s.institution || "-"}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 bangla-font">
                    {s.class_name && <span>শ্রেণি: {s.class_name}</span>}
                    {s.subject_name && <span>{s.subject_name}</span>}
                    {s.full_marks && <span>পূর্ণমান: {s.full_marks}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(s.created_at).toLocaleDateString("bn-BD")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="bangla-font">নতুন প্রশ্নসেট তৈরি</DialogTitle>
          </DialogHeader>
          <FormFields />
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }} className="bangla-font">বাতিল</Button>
            <Button onClick={handleCreate} disabled={saving} className="bangla-font">
              {saving ? "তৈরি হচ্ছে..." : "তৈরি করুন"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editSet} onOpenChange={() => { setEditSet(null); resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="bangla-font">প্রশ্নসেট সম্পাদনা</DialogTitle>
          </DialogHeader>
          <FormFields />
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="outline" onClick={() => { setEditSet(null); resetForm(); }} className="bangla-font">বাতিল</Button>
            <Button onClick={handleUpdate} disabled={saving} className="bangla-font">
              {saving ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
