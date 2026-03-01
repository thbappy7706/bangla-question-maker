import jsPDF from "jspdf";
import { QuestionSet, Question, SrijonshilStructure, SongkhiptoStructure, MCQStructure } from "@/types";

const optionLabels = ["ক", "খ", "গ", "ঘ"];

export async function exportToPDF(questionSet: QuestionSet, questions: Question[]) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = 20;

  const addText = (text: string, x: number, size: number, style: "normal" | "bold" = "normal", color = "#000000") => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", style);
    const lines = pdf.splitTextToSize(text || "", contentWidth - (x - margin));
    pdf.text(lines, x, y);
    y += (size / 2.5) * lines.length + 2;
    return lines.length;
  };

  const checkPage = (needed: number) => {
    if (y + needed > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  // Header
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 14, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("BANGLA QUESTION MAKER", pageWidth / 2, 9, { align: "center" });
  pdf.setTextColor(0, 0, 0);
  y = 22;

  if (questionSet.institution) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(questionSet.institution, pageWidth / 2, y, { align: "center" });
    y += 8;
  }

  if (questionSet.exam_name) {
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(questionSet.exam_name, pageWidth / 2, y, { align: "center" });
    y += 7;
  }

  const infoLine = [
    questionSet.class_name ? `Class: ${questionSet.class_name}` : "",
    questionSet.subject_name ? `Subject: ${questionSet.subject_name}` : "",
  ].filter(Boolean).join("   |   ");

  if (infoLine) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(infoLine, pageWidth / 2, y, { align: "center" });
    y += 6;
  }

  const marksLine = [
    questionSet.full_marks ? `Full Marks: ${questionSet.full_marks}` : "",
    questionSet.duration ? `Time: ${questionSet.duration} min` : "",
  ].filter(Boolean).join("   |   ");

  if (marksLine) {
    pdf.setFontSize(10);
    pdf.text(marksLine, pageWidth / 2, y, { align: "center" });
    y += 6;
  }

  if (questionSet.note) {
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "italic");
    pdf.text(`Note: ${questionSet.note}`, pageWidth / 2, y, { align: "center" });
    y += 6;
  }

  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Group by type
  const srijonshil = questions.filter(q => q.type === "srijonshil");
  const songkhipto = questions.filter(q => q.type === "songkhipto");
  const mcq = questions.filter(q => q.type === "mcq");

  const addSectionHeader = (title: string) => {
    checkPage(20);
    pdf.setFillColor(239, 246, 255);
    pdf.rect(margin, y - 5, contentWidth, 10, "F");
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, margin + 2, y + 1);
    y += 10;
  };

  if (srijonshil.length > 0) {
    addSectionHeader("Srijonshil (Creative Questions)");
    srijonshil.forEach((q, i) => {
      const s = q.structure as SrijonshilStructure;
      checkPage(40);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${i + 1}.`, margin, y);
      y += 5;

      if (s.uddipok) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(9);
        const uddLines = pdf.splitTextToSize(`Uddipok: ${s.uddipok}`, contentWidth - 5);
        pdf.text(uddLines, margin + 4, y);
        y += (9 / 2.5) * uddLines.length + 3;
      }

      const parts = [
        { key: "ko", label: "a)" },
        { key: "kho", label: "b)" },
        { key: "go", label: "c)" },
        { key: "gho", label: "d)" },
      ];
      parts.forEach(p => {
        const part = s[p.key as keyof Pick<SrijonshilStructure, "ko"|"kho"|"go"|"gho">];
        checkPage(15);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const qLines = pdf.splitTextToSize(`${p.label} ${part.question}`, contentWidth - 8);
        pdf.text(qLines, margin + 8, y);
        y += (9 / 2.5) * qLines.length + 2;
      });
      y += 4;
    });
  }

  if (songkhipto.length > 0) {
    addSectionHeader("Songkhipto (Short Questions)");
    songkhipto.forEach((q, i) => {
      const s = q.structure as SongkhiptoStructure;
      checkPage(20);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const qLines = pdf.splitTextToSize(`${i + 1}. ${s.question}`, contentWidth);
      pdf.text(qLines, margin, y);
      y += (9 / 2.5) * qLines.length + 4;
    });
  }

  if (mcq.length > 0) {
    addSectionHeader("MCQ (Multiple Choice Questions)");
    mcq.forEach((q, i) => {
      const s = q.structure as MCQStructure;
      checkPage(30);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const qLines = pdf.splitTextToSize(`${i + 1}. ${s.question}`, contentWidth);
      pdf.text(qLines, margin, y);
      y += (9 / 2.5) * qLines.length + 2;

      s.options.forEach((opt, idx) => {
        checkPage(10);
        const optLines = pdf.splitTextToSize(`${optionLabels[idx]}) ${opt}`, (contentWidth / 2) - 4);
        pdf.text(optLines, margin + 6 + (idx % 2) * (contentWidth / 2), y);
        if (idx % 2 === 1) y += (9 / 2.5) * optLines.length + 2;
      });
      y += 4;
    });
  }

  // Page numbers
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, { align: "center" });
    pdf.setTextColor(0, 0, 0);
  }

  const filename = `${questionSet.exam_name || "question-paper"}.pdf`;
  pdf.save(filename);
}
