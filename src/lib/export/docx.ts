import { Document, Paragraph, TextRun, AlignmentType, BorderStyle, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { QuestionSet, Question, SrijonshilStructure, SongkhiptoStructure, MCQStructure } from '@/types';
import { getT, Lang } from '@/lib/i18n';

const OPT = ['ক', 'খ', 'গ', 'ঘ'];

function p(runs: TextRun[], opts: Partial<{ spacing: number; indent: number; align: (typeof AlignmentType)[keyof typeof AlignmentType] }> = {}) {
  return new Paragraph({
    children: runs,
    spacing: { before: opts.spacing ?? 80, after: opts.spacing ?? 80 },
    indent: opts.indent ? { left: opts.indent } : undefined,
    alignment: opts.align,
  });
}

function t(text: string, opts: { bold?: boolean; size?: number; italic?: boolean; color?: string } = {}) {
  return new TextRun({ text, bold: opts.bold, size: opts.size ?? 20, italics: opts.italic, color: opts.color });
}

export async function exportToDocx(qs: QuestionSet, questions: Question[], lang: Lang = 'bn') {
  const tr = getT(lang);
  const children: Paragraph[] = [];

  const addLine = () => children.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'A7F3D0' } },
    spacing: { before: 60, after: 100 },
    children: [],
  }));

  // Title
  if (qs.institution) children.push(p([t(qs.institution, { bold: true, size: 28 })], { align: AlignmentType.CENTER, spacing: 120 }));
  if (qs.examName) children.push(p([t(qs.examName, { bold: true, size: 24 })], { align: AlignmentType.CENTER }));

  const info = [qs.className && tr('export.class', qs.className), qs.subjectName && tr('export.subject', qs.subjectName)].filter(Boolean).join('   |   ');
  const marks = [qs.fullMarks && tr('export.fullMarks', qs.fullMarks), qs.duration && tr('export.duration', qs.duration)].filter(Boolean).join('   |   ');
  if (info) children.push(p([t(info, { size: 18 })], { align: AlignmentType.CENTER }));
  if (marks) children.push(p([t(marks, { size: 18 })], { align: AlignmentType.CENTER }));
  if (qs.note) children.push(p([t(tr('export.note', qs.note), { size: 16, italic: true, color: '666666' })], { align: AlignmentType.CENTER }));

  addLine();

  const srijonshil = questions.filter(q => q.type === 'srijonshil');
  const songkhipto = questions.filter(q => q.type === 'songkhipto');
  const mcq = questions.filter(q => q.type === 'mcq');

  const sectionHead = (title: string) => children.push(
    p([t(title, { bold: true, size: 22, color: '065f46' })], { spacing: 200 })
  );

  if (srijonshil.length > 0) {
    sectionHead(tr('export.srijonshilSection'));
    srijonshil.forEach((q, i) => {
      const s = q.structure as SrijonshilStructure;
      children.push(p([t(tr('export.question', i + 1), { bold: true, size: 20 })]));
      if (s.uddipok) children.push(p([t(tr('export.uddipok', s.uddipok), { italic: true, size: 18, color: '444444' })], { indent: 360 }));
      children.push(p([t(`ক) ${s.ko.question}`)], { indent: 360 }));
      children.push(p([t(`খ) ${s.kho.question}`)], { indent: 360 }));
      children.push(p([t(`গ) ${s.go.question}`)], { indent: 360 }));
      children.push(p([t(`ঘ) ${s.gho.question}`)], { indent: 360, spacing: 160 }));
    });
  }

  if (songkhipto.length > 0) {
    sectionHead(tr('export.songkhiptoSection'));
    songkhipto.forEach((q, i) => {
      const s = q.structure as SongkhiptoStructure;
      children.push(p([t(`${i + 1}. ${s.question}`)], { spacing: 120 }));
    });
  }

  if (mcq.length > 0) {
    sectionHead(tr('export.mcqSection'));
    mcq.forEach((q, i) => {
      const s = q.structure as MCQStructure;
      children.push(p([t(`${i + 1}. ${s.question}`, { bold: true })]));
      s.options.forEach((opt, idx) => {
        children.push(p([t(`${OPT[idx]}) ${opt}`)], { indent: 360 }));
      });
      children.push(p([], { spacing: 40 }));
    });
  }

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${qs.examName || 'question-paper'}.docx`);
}
