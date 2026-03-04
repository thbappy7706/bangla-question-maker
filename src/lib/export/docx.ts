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
  return new TextRun({ text, bold: opts.bold, size: opts.size ?? 24, italics: opts.italic, color: opts.color, font: 'Hind Siliguri' });
}

export async function exportToDocx(qs: QuestionSet, questions: Question[], lang: Lang = 'bn') {
  const tr = getT(lang);
  const children: Paragraph[] = [];

  const addLine = () => children.push(new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: '059669' } },
    spacing: { before: 100, after: 200 },
    children: [],
  }));

  // Title
  if (qs.institution) children.push(p([t(qs.institution, { bold: true, size: 36 })], { align: AlignmentType.CENTER, spacing: 120 }));
  if (qs.examName) children.push(p([t(qs.examName, { bold: true, size: 28 })], { align: AlignmentType.CENTER, spacing: 100 }));

  const info = [qs.className && tr('export.class', qs.className), qs.subjectName && tr('export.subject', qs.subjectName)].filter(Boolean).join('   |   ');
  const marks = [qs.fullMarks && tr('export.fullMarks', qs.fullMarks), qs.duration && tr('export.duration', qs.duration)].filter(Boolean).join('   |   ');
  if (info) children.push(p([t(info, { size: 22, bold: true })], { align: AlignmentType.CENTER, spacing: 40 }));
  if (marks) children.push(p([t(marks, { size: 22, bold: true })], { align: AlignmentType.CENTER, spacing: 40 }));
  if (qs.note) children.push(p([t(tr('export.note', qs.note), { size: 20, italic: true, color: '444444' })], { align: AlignmentType.CENTER, spacing: 60 }));

  addLine();

  const srijonshil = questions.filter(q => q.type === 'srijonshil');
  const songkhipto = questions.filter(q => q.type === 'songkhipto');
  const mcq = questions.filter(q => q.type === 'mcq');

  const sectionHead = (title: string) => children.push(
    p([t(title, { bold: true, size: 26, color: '065f46' })], { spacing: 300 })
  );

  if (srijonshil.length > 0) {
    sectionHead(tr('export.srijonshilSection'));
    srijonshil.forEach((q, i) => {
      const s = q.structure as SrijonshilStructure;
      if (s.uddipok) {
        children.push(p([
          t(`${i + 1}. `, { bold: true, size: 24 }),
          t(tr('export.uddipok', s.uddipok), { italic: true, size: 24, color: '333333' })
        ], { spacing: 120 }));
      } else {
        children.push(p([t(`${i + 1}.`, { bold: true, size: 24 })], { spacing: 120 }));
      }
      children.push(p([t(`ক) ${s.ko.question}`, { size: 24 })], { indent: 720, spacing: 60 }));
      children.push(p([t(`খ) ${s.kho.question}`, { size: 24 })], { indent: 720, spacing: 60 }));
      children.push(p([t(`গ) ${s.go.question}`, { size: 24 })], { indent: 720, spacing: 60 }));
      children.push(p([t(`ঘ) ${s.gho.question}`, { size: 24 })], { indent: 720, spacing: 160 }));
    });
  }

  if (songkhipto.length > 0) {
    sectionHead(tr('export.songkhiptoSection'));
    songkhipto.forEach((q, i) => {
      const s = q.structure as SongkhiptoStructure;
      children.push(p([t(`${i + 1}. ${s.question}`, { size: 24 })], { spacing: 140 }));
    });
  }

  if (mcq.length > 0) {
    sectionHead(tr('export.mcqSection'));

    const addMcq = (num: number, s: MCQStructure, headless: boolean) => {
      if (!headless && s.mcqType === 'unified' && s.stem) {
        children.push(p([t(s.stem, { italic: true, size: 24, color: '333333', bold: true })], { indent: 400, spacing: 100 }));
      }
      children.push(p([t(`${num}. ${s.question}`, { bold: true, size: 24 })], { spacing: headless ? 100 : 160 }));
      if (s.mcqType === 'multi' && s.statements) {
        s.statements.forEach((st, idx) => {
          if (st) children.push(p([t(`${['i', 'ii', 'iii'][idx]}. ${st}`, { size: 24 })], { indent: 720, spacing: 40 }));
        });
        children.push(p([t('নিচের কোনটি সঠিক?', { bold: true, size: 24 })], { indent: 720, spacing: 60 }));
      }
      const optRuns: TextRun[] = [];
      s.options.forEach((opt, idx) => {
        optRuns.push(t(`${OPT[idx]}) ${opt}`, { size: 24 }));
        if (idx < s.options.length - 1) optRuns.push(t('    ', { size: 24 })); // Spacing between options
      });
      children.push(p(optRuns, { indent: 720, spacing: 40 }));
    };

    let idx = 0;
    while (idx < mcq.length) {
      const q = mcq[idx];
      const s = q.structure as MCQStructure;

      if (s.mcqType === 'unified' && s.stem) {
        let j = idx + 1;
        while (j < mcq.length) {
          const nextQ = mcq[j];
          const nextS = nextQ.structure as MCQStructure;
          if (nextS.mcqType === 'unified' && nextS.stem === s.stem) j++;
          else break;
        }

        if (j > idx + 1) {
          const rangeStr = `${idx + 1} ও ${j}`;
          if (!s.stem.includes('নিচের তথ্যের আলোকে') && !s.stem.includes('Based on the information')) {
            children.push(p([t(tr('mcq.unifiedInstruction', rangeStr), { bold: true, size: 24, color: '065f46' })], { align: AlignmentType.CENTER, spacing: 200 }));
          }
          children.push(p([t(s.stem, { italic: true, size: 24, bold: true })], { align: AlignmentType.CENTER, spacing: 160 }));

          for (let k = idx; k < j; k++) {
            addMcq(k + 1, mcq[k].structure as MCQStructure, true);
          }
          idx = j;
          children.push(p([], { spacing: 200 }));
          continue;
        }
      }

      addMcq(idx + 1, s, false);
      children.push(p([], { spacing: 120 }));
      idx++;
    }
  }

  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${qs.examName || 'question-paper'}.docx`);
}
