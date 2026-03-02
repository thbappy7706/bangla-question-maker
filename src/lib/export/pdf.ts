import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QuestionSet, Question, SrijonshilStructure, SongkhiptoStructure, MCQStructure } from '@/types';
import { getT, Lang } from '@/lib/i18n';

const OPT = ['ক', 'খ', 'গ', 'ঘ'];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br/>');
}

function buildHtml(qs: QuestionSet, questions: Question[], t: ReturnType<typeof getT>): string {
  let html = '';

  // Header bar
  html += `<div style="background:#059669;color:#fff;text-align:center;padding:12px 20px;font-weight:700;font-size:13px;letter-spacing:0.5px;">${escapeHtml(t('export.headerTitle'))}</div>`;

  // Body content
  html += `<div style="padding:24px 32px;">`;

  // Title
  if (qs.institution) {
    html += `<h1 style="text-align:center;font-size:19px;font-weight:700;margin:0 0 6px 0;color:#111;">${escapeHtml(qs.institution)}</h1>`;
  }
  if (qs.examName) {
    html += `<h2 style="text-align:center;font-size:16px;font-weight:700;color:#333;margin:0 0 6px 0;">${escapeHtml(qs.examName)}</h2>`;
  }

  // Meta info
  const row1 = [
    qs.className && t('export.class', qs.className),
    qs.subjectName && t('export.subject', qs.subjectName),
  ].filter(Boolean).join('   |   ');
  const row2 = [
    qs.fullMarks && t('export.fullMarks', qs.fullMarks),
    qs.duration && t('export.duration', qs.duration),
  ].filter(Boolean).join('   |   ');

  if (row1) html += `<p style="text-align:center;font-size:12px;color:#444;margin:3px 0;">${escapeHtml(row1)}</p>`;
  if (row2) html += `<p style="text-align:center;font-size:12px;color:#444;margin:3px 0;">${escapeHtml(row2)}</p>`;
  if (qs.note) html += `<p style="text-align:center;font-size:11px;color:#666;font-style:italic;margin:3px 0;">${escapeHtml(t('export.note', qs.note))}</p>`;

  // Divider
  html += `<hr style="border:none;border-top:2px solid #059669;margin:16px 0;" />`;

  // Group questions by type
  const srijonshil = questions.filter(q => q.type === 'srijonshil');
  const songkhipto = questions.filter(q => q.type === 'songkhipto');
  const mcq = questions.filter(q => q.type === 'mcq');

  const sectionHeader = (title: string) =>
    `<div style="background:#ecfdf5;border-radius:8px;padding:8px 14px;margin:18px 0 12px 0;">
      <span style="font-size:13px;font-weight:700;color:#065f46;">${escapeHtml(title)}</span>
    </div>`;

  // Srijonshil
  if (srijonshil.length > 0) {
    html += sectionHeader(t('export.srijonshilSection'));
    srijonshil.forEach((q, i) => {
      const s = q.structure as SrijonshilStructure;
      html += `<div style="margin-bottom:16px;">`;
      html += `<p style="font-size:13px;font-weight:700;color:#111;margin:0 0 4px 0;">${i + 1}.</p>`;
      if (s.uddipok) {
        html += `<p style="font-size:11px;font-style:italic;color:#555;margin:0 0 6px 16px;line-height:1.6;">${escapeHtml(t('export.uddipok', s.uddipok))}</p>`;
      }
      const parts = [
        ['ক)', s.ko.question],
        ['খ)', s.kho.question],
        ['গ)', s.go.question],
        ['ঘ)', s.gho.question],
      ];
      parts.forEach(([lbl, qtxt]) => {
        html += `<p style="font-size:12px;color:#222;margin:3px 0 3px 28px;line-height:1.5;">${escapeHtml(`${lbl} ${qtxt}`)}</p>`;
      });
      html += `</div>`;
    });
  }

  // Songkhipto
  if (songkhipto.length > 0) {
    html += sectionHeader(t('export.songkhiptoSection'));
    songkhipto.forEach((q, i) => {
      const s = q.structure as SongkhiptoStructure;
      html += `<p style="font-size:12px;color:#222;margin:6px 0;line-height:1.5;">${escapeHtml(`${i + 1}. ${s.question}`)}</p>`;
    });
  }

  // MCQ
  if (mcq.length > 0) {
    html += sectionHeader(t('export.mcqSection'));
    mcq.forEach((q, i) => {
      const s = q.structure as MCQStructure;
      html += `<p style="font-size:12px;font-weight:600;color:#222;margin:10px 0 6px 0;line-height:1.5;">${escapeHtml(`${i + 1}. ${s.question}`)}</p>`;
      html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 20px;margin-left:16px;">`;
      s.options.forEach((opt, idx) => {
        html += `<p style="font-size:11px;color:#333;margin:2px 0;line-height:1.5;">${escapeHtml(`${OPT[idx]}) ${opt}`)}</p>`;
      });
      html += `</div>`;
    });
  }

  html += `</div>`; // close body content

  return html;
}

export async function exportToPDF(qs: QuestionSet, questions: Question[], lang: Lang = 'bn') {
  const t = getT(lang);

  // Create a temporary off-screen container
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 794px;
    font-family: 'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif;
    background: #ffffff;
    color: #111111;
    box-sizing: border-box;
    z-index: -1;
    -webkit-font-smoothing: antialiased;
  `;
  container.innerHTML = buildHtml(qs, questions, t);
  document.body.appendChild(container);

  try {
    // Wait a tick for fonts to render
    await new Promise(r => setTimeout(r, 100));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Subsequent pages
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Add page numbers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor('#999999');
      pdf.text(`${i} / ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    }

    pdf.save(`${qs.examName || 'question-paper'}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
