import {
  Document, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType,
  Packer,
} from "docx";
import { saveAs } from "file-saver";
import { QuestionSet, Question, SrijonshilStructure, SongkhiptoStructure, MCQStructure } from "@/types";

const optionLabels = ["ক", "খ", "গ", "ঘ"];

function heading(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, color: "2563EB" })],
    spacing: { before: 200, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCDDFF" } },
  });
}

function body(text: string, indent = 0, bold = false) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, bold })],
    spacing: { before: 60, after: 60 },
    indent: { left: indent },
  });
}

export async function exportToDocx(questionSet: QuestionSet, questions: Question[]) {
  const children: (Paragraph | Table)[] = [];

  // Title section
  if (questionSet.institution) {
    children.push(new Paragraph({
      children: [new TextRun({ text: questionSet.institution, bold: true, size: 28 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }));
  }
  if (questionSet.exam_name) {
    children.push(new Paragraph({
      children: [new TextRun({ text: questionSet.exam_name, bold: true, size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }));
  }

  const infoParts = [
    questionSet.class_name ? `Class: ${questionSet.class_name}` : "",
    questionSet.subject_name ? `Subject: ${questionSet.subject_name}` : "",
    questionSet.full_marks ? `Full Marks: ${questionSet.full_marks}` : "",
    questionSet.duration ? `Duration: ${questionSet.duration} min` : "",
  ].filter(Boolean).join("   |   ");

  if (infoParts) {
    children.push(new Paragraph({
      children: [new TextRun({ text: infoParts, size: 18 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }));
  }

  if (questionSet.note) {
    children.push(new Paragraph({
      children: [new TextRun({ text: `Note: ${questionSet.note}`, size: 18, italics: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }));
  }

  const srijonshil = questions.filter(q => q.type === "srijonshil");
  const songkhipto = questions.filter(q => q.type === "songkhipto");
  const mcq = questions.filter(q => q.type === "mcq");

  if (srijonshil.length > 0) {
    children.push(heading("সৃজনশীল প্রশ্নাবলী (Creative Questions)"));
    srijonshil.forEach((q, i) => {
      const s = q.structure as SrijonshilStructure;
      children.push(body(`প্রশ্ন ${i + 1}`, 0, true));
      if (s.uddipok) children.push(body(`উদ্দীপক: ${s.uddipok}`, 200, false));
      children.push(body(`ক) ${s.ko.question}`, 400));
      children.push(body(`খ) ${s.kho.question}`, 400));
      children.push(body(`গ) ${s.go.question}`, 400));
      children.push(body(`ঘ) ${s.gho.question}`, 400));
      children.push(new Paragraph({ spacing: { after: 100 } }));
    });
  }

  if (songkhipto.length > 0) {
    children.push(heading("সংক্ষিপ্ত প্রশ্নাবলী (Short Questions)"));
    songkhipto.forEach((q, i) => {
      const s = q.structure as SongkhiptoStructure;
      children.push(body(`${i + 1}. ${s.question}`));
      if (s.answer) children.push(body(`উত্তর: ${s.answer}`, 400));
      children.push(new Paragraph({ spacing: { after: 60 } }));
    });
  }

  if (mcq.length > 0) {
    children.push(heading("বহুনির্বাচনী প্রশ্নাবলী (MCQ)"));
    mcq.forEach((q, i) => {
      const s = q.structure as MCQStructure;
      children.push(body(`${i + 1}. ${s.question}`, 0, false));
      s.options.forEach((opt, idx) => {
        children.push(body(`${optionLabels[idx]}) ${opt}`, 400));
      });
      children.push(new Paragraph({ spacing: { after: 80 } }));
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${questionSet.exam_name || "question-paper"}.docx`);
}
