import jsPDF from 'jspdf';
import { QuestionSet, Question, SrijonshilStructure, SongkhiptoStructure, MCQStructure } from '@/types';

const OPT = ['ক', 'খ', 'গ', 'ঘ'];

export async function exportToPDF(qs: QuestionSet, questions: Question[]) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, M = 18, CW = W - M * 2;
  let y = 15;

  const line = (txt: string, x: number, size: number, bold = false, color = '#111111') => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setTextColor(color);
    const lines = pdf.splitTextToSize(txt, CW - (x - M));
    pdf.text(lines, x, y);
    y += ((size * 0.35) + 1) * lines.length;
    return lines.length;
  };

  const newPage = (need = 20) => {
    if (y + need > 282) { pdf.addPage(); y = 15; }
  };

  // ─── Header bar ───────────────────────────────────────────────
  pdf.setFillColor(5, 150, 105);
  pdf.rect(0, 0, W, 12, 'F');
  pdf.setFontSize(9); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#ffffff');
  pdf.text('BANGLA QUESTION MAKER', W / 2, 8, { align: 'center' });
  y = 20;

  // ─── Title ────────────────────────────────────────────────────
  if (qs.institution) { pdf.setFontSize(13); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#111'); pdf.text(qs.institution, W/2, y, { align:'center' }); y+=7; }
  if (qs.examName) { pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor('#333'); pdf.text(qs.examName, W/2, y, { align:'center' }); y+=6; }

  const row1 = [qs.className && `শ্রেণি: ${qs.className}`, qs.subjectName && `বিষয়: ${qs.subjectName}`].filter(Boolean).join('   |   ');
  const row2 = [qs.fullMarks && `পূর্ণমান: ${qs.fullMarks}`, qs.duration && `সময়: ${qs.duration} মিনিট`].filter(Boolean).join('   |   ');

  if (row1) { pdf.setFontSize(9); pdf.setFont('helvetica','normal'); pdf.setTextColor('#444'); pdf.text(row1, W/2, y, {align:'center'}); y+=5; }
  if (row2) { pdf.setFontSize(9); pdf.text(row2, W/2, y, {align:'center'}); y+=5; }
  if (qs.note) { pdf.setFontSize(8); pdf.setFont('helvetica','italic'); pdf.setTextColor('#666'); pdf.text(`বিঃদ্রঃ ${qs.note}`, W/2, y, {align:'center'}); y+=5; }

  pdf.setDrawColor(5, 150, 105); pdf.setLineWidth(0.5);
  pdf.line(M, y, W-M, y); y+=6;

  // ─── Questions ────────────────────────────────────────────────
  const srijonshil = questions.filter(q => q.type === 'srijonshil');
  const songkhipto = questions.filter(q => q.type === 'songkhipto');
  const mcq = questions.filter(q => q.type === 'mcq');

  const sectionHeader = (title: string) => {
    newPage(18);
    pdf.setFillColor(236, 253, 245);
    pdf.roundedRect(M, y-4, CW, 11, 2, 2, 'F');
    pdf.setFontSize(10); pdf.setFont('helvetica','bold'); pdf.setTextColor('#065f46');
    pdf.text(title, M+3, y+3.5);
    y += 12;
  };

  if (srijonshil.length > 0) {
    sectionHeader('সৃজনশীল প্রশ্নাবলী (Creative Questions)');
    srijonshil.forEach((q, i) => {
      const s = q.structure as SrijonshilStructure;
      newPage(40);
      pdf.setFontSize(10); pdf.setFont('helvetica','bold'); pdf.setTextColor('#111');
      pdf.text(`${i+1}.`, M, y); y+=4;
      if (s.uddipok) {
        pdf.setFontSize(8.5); pdf.setFont('helvetica','italic'); pdf.setTextColor('#555');
        const ul = pdf.splitTextToSize(`উদ্দীপক: ${s.uddipok}`, CW-6);
        pdf.text(ul, M+4, y); y += (8.5*0.35+1)*ul.length + 2;
      }
      [['ক)', s.ko.question], ['খ)', s.kho.question], ['গ)', s.go.question], ['ঘ)', s.gho.question]].forEach(([lbl, qtxt]) => {
        newPage(12);
        pdf.setFont('helvetica','normal'); pdf.setFontSize(9); pdf.setTextColor('#222');
        const ql = pdf.splitTextToSize(`${lbl} ${qtxt}`, CW-10);
        pdf.text(ql, M+8, y); y += (9*0.35+1)*ql.length+1.5;
      });
      y += 3;
    });
  }

  if (songkhipto.length > 0) {
    sectionHeader('সংক্ষিপ্ত প্রশ্নাবলী (Short Questions)');
    songkhipto.forEach((q, i) => {
      const s = q.structure as SongkhiptoStructure;
      newPage(15);
      pdf.setFont('helvetica','normal'); pdf.setFontSize(9); pdf.setTextColor('#222');
      const ql = pdf.splitTextToSize(`${i+1}. ${s.question}`, CW);
      pdf.text(ql, M, y); y += (9*0.35+1)*ql.length + 3;
    });
  }

  if (mcq.length > 0) {
    sectionHeader('বহুনির্বাচনী প্রশ্নাবলী (MCQ)');
    mcq.forEach((q, i) => {
      const s = q.structure as MCQStructure;
      newPage(28);
      pdf.setFont('helvetica','normal'); pdf.setFontSize(9); pdf.setTextColor('#222');
      const ql = pdf.splitTextToSize(`${i+1}. ${s.question}`, CW);
      pdf.text(ql, M, y); y += (9*0.35+1)*ql.length + 2;
      s.options.forEach((opt, idx) => {
        newPage(8);
        const col = idx % 2 === 0 ? M+4 : M + CW/2 + 4;
        pdf.setFontSize(8.5);
        const ol = pdf.splitTextToSize(`${OPT[idx]}) ${opt}`, CW/2-6);
        pdf.text(ol, col, y);
        if (idx % 2 === 1 || idx === 3) y += (8.5*0.35+1)*ol.length + 1;
      });
      if (s.options.length % 2 !== 0) y += 5;
      y += 2;
    });
  }

  // Page numbers
  const pc = pdf.getNumberOfPages();
  for (let i=1; i<=pc; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7); pdf.setFont('helvetica','normal'); pdf.setTextColor('#999');
    pdf.text(`${i} / ${pc}`, W/2, 292, { align: 'center' });
  }

  pdf.save(`${qs.examName || 'question-paper'}.pdf`);
}
