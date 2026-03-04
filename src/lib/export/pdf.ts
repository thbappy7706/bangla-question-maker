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
    .replace(/&lt;sub&gt;(.*?)&lt;\/sub&gt;/g, '<sub>$1</sub>')
    .replace(/&lt;sup&gt;(.*?)&lt;\/sup&gt;/g, '<sup>$1</sup>')
    .replace(/\^\{(.*?)\}/g, '<sup>$1</sup>') // ^ {sup}
    .replace(/\^(\d|[a-zA-Z])/g, '<sup>$1</sup>') // ^sup (single char)
    .replace(/_\{(.*?)\}/g, '<sub>$1</sub>') // _ {sub}
    .replace(/_(\d|[a-zA-Z])/g, '<sub>$1</sub>') // _sub (single char)
    .replace(/\n/g, '<br/>');
}

function buildHtml(qs: QuestionSet, questions: Question[], t: ReturnType<typeof getT>): string {
  let html = '';

  // Body content
  html += `<div style="padding:24px 32px;">`;

  // Title
  if (qs.institution) {
    html += `<h1 style="text-align:center;font-size:26px;font-weight:700;margin:0 0 8px 0;color:#111;">${escapeHtml(qs.institution)}</h1>`;
  }
  if (qs.examName) {
    html += `<h2 style="text-align:center;font-size:20px;font-weight:700;color:#333;margin:0 0 12px 0;">${escapeHtml(qs.examName)}</h2>`;
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

  if (row1) html += `<p style="text-align:center;font-size:15px;color:#222;margin:4px 0;font-weight:500;">${escapeHtml(row1)}</p>`;
  if (row2) html += `<p style="text-align:center;font-size:15px;color:#222;margin:4px 0;font-weight:500;">${escapeHtml(row2)}</p>`;
  if (qs.note) html += `<p style="text-align:center;font-size:14px;color:#555;font-style:italic;margin:6px 0;">${escapeHtml(t('export.note', qs.note))}</p>`;

  // Divider
  html += `<hr style="border:none;border-top:2px solid #333;margin:20px 0;" />`;

  // Group questions by type
  const srijonshil = questions.filter(q => q.type === 'srijonshil');
  const songkhipto = questions.filter(q => q.type === 'songkhipto');
  const mcq = questions.filter(q => q.type === 'mcq');

  const sectionHeader = (title: string) =>
    `<div style="background:#ecfdf5;border-radius:10px;padding:10px 16px;margin:24px 0 16px 0;">
      <span style="font-size:16px;font-weight:700;color:#065f46;">${escapeHtml(title)}</span>
    </div>`;

  // Srijonshil
  if (srijonshil.length > 0) {
    html += sectionHeader(t('export.srijonshilSection'));
    srijonshil.forEach((q, i) => {
      const s = q.structure as SrijonshilStructure;
      html += `<div style="margin-bottom:20px;">`;
      if (s.uddipok?.trim()) {
        html += `<p style="font-size:16px;color:#111;margin:0 0 10px 0;line-height:1.7;">
          <span style="font-weight:700;">${i + 1}.</span> 
          <span style="font-style:italic;margin-left:8px;">${escapeHtml(t('export.uddipok', s.uddipok))}</span>
        </p>`;
        if (s.image) {
          html += `<div style="text-align:center;margin:10px 0 15px 0;"><img src="${s.image}" style="max-width:80%;max-height:250px;border-radius:8px;" /></div>`;
        }
      } else if (s.image) {
        html += `<div style="display:flex;align-items:flex-start;gap:10px;margin:0 0 15px 0;">
          <span style="font-size:16px;font-weight:700;color:#111;padding-top:2px;">${i + 1}.</span>
          <div style="flex-grow:1;"><img src="${s.image}" style="max-width:75%;max-height:250px;border-radius:8px;" /></div>
        </div>`;
      } else {
        html += `<p style="font-size:16px;font-weight:700;color:#111;margin:0 0 6px 0;">${i + 1}.</p>`;
      }
      const parts = [
        ['ক)', s.ko.question],
        ['খ)', s.kho.question],
        ['গ)', s.go.question],
        ['ঘ)', s.gho.question],
      ];
      parts.forEach(([lbl, qtxt]) => {
        html += `<p style="font-size:16px;color:#111;margin:4px 0 4px 34px;line-height:1.6;">${escapeHtml(`${lbl} ${qtxt}`)}</p>`;
      });
      html += `</div>`;
    });
  }

  // Songkhipto
  if (songkhipto.length > 0) {
    html += sectionHeader(t('export.songkhiptoSection'));
    songkhipto.forEach((q, i) => {
      const s = q.structure as SongkhiptoStructure;
      if (s.question?.trim()) {
        html += `<p style="font-size:16px;color:#111;margin:12px 0;line-height:1.6;">${escapeHtml(`${i + 1}. ${s.question}`)}</p>`;
        if (s.image) {
          html += `<div style="text-align:center;margin:10px 0 15px 0;"><img src="${s.image}" style="max-width:80%;max-height:250px;border-radius:8px;" /></div>`;
        }
      } else if (s.image) {
        html += `<div style="display:flex;align-items:flex-start;gap:10px;margin:12px 0 15px 0;">
          <span style="font-size:16px;font-weight:700;color:#111;padding-top:2px;">${i + 1}.</span>
          <div style="flex-grow:1;"><img src="${s.image}" style="max-width:75%;max-height:250px;border-radius:8px;" /></div>
        </div>`;
      }
    });
  }

  // MCQ
  if (mcq.length > 0) {
    html += sectionHeader(t('export.mcqSection'));

    const renderSingleMCQ = (num: number, s: MCQStructure, hideStem: boolean) => {
      let mhtml = `<div style="margin-bottom:18px;">`;

      if (!hideStem && s.mcqType === 'unified' && s.stem) {
        mhtml += `<p style="font-size:14px;font-style:italic;color:#333;margin:4px 0 8px 18px;line-height:1.6;font-weight:600;">${escapeHtml(s.stem)}</p>`;
      }

      if (s.question?.trim()) {
        mhtml += `<p style="font-size:16px;font-weight:600;color:#111;margin:0 0 8px 0;line-height:1.5;">${escapeHtml(`${num}. ${s.question}`)}</p>`;
        if (s.image) {
          mhtml += `<div style="text-align:center;margin:8px 0 12px 0;"><img src="${s.image}" style="max-width:70%;max-height:200px;border-radius:6px;" /></div>`;
        }
      } else if (s.image) {
        mhtml += `<div style="display:flex;align-items:flex-start;gap:8px;margin:0 0 12px 0;">
          <span style="font-size:16px;font-weight:700;color:#111;padding-top:1px;">${num}.</span>
          <div style="flex-grow:1;"><img src="${s.image}" style="max-width:65%;max-height:200px;border-radius:6px;" /></div>
        </div>`;
      }

      if (s.mcqType === 'multi' && s.statements) {
        mhtml += `<div style="margin:2px 0 10px 20px;">`;
        s.statements.forEach((st, idx) => {
          if (st) mhtml += `<p style="font-size:16px;color:#222;margin:2px 0;">${['i', 'ii', 'iii'][idx]}. ${escapeHtml(st)}</p>`;
        });
        mhtml += `<p style="font-size:16px;font-weight:700;margin-top:6px;">নিচের কোনটি সঠিক?</p>`;
        mhtml += `</div>`;
      }

      mhtml += `<div style="display:flex; flex-wrap:wrap; gap:4px 30px; margin-left:20px;">`;
      s.options.forEach((opt, idx) => {
        mhtml += `<p style="font-size:16px;color:#111;margin:2px 0;line-height:1.5;white-space:nowrap;">${escapeHtml(`${OPT[idx]}) ${opt}`)}</p>`;
      });
      mhtml += `</div>`;
      mhtml += `</div>`;
      return mhtml;
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
          html += `<div style="margin-bottom:24px; border: 1px dashed #d1d5db; padding: 14px; border-radius: 12px; background: #fafafa;">`;
          if (!s.stem.includes('নিচের তথ্যের আলোকে') && !s.stem.includes('Based on the information')) {
            html += `<p style="font-size:16px;font-weight:700;margin:0 0 10px 0;color:#065f46;text-align:center;">${escapeHtml(t('mcq.unifiedInstruction', rangeStr))}</p>`;
          }
          html += `<p style="font-size:16px;font-style:italic;color:#111;margin:0 0 14px 0;line-height:1.7;font-weight:600;text-align:center;">${escapeHtml(s.stem)}</p>`;

          for (let k = idx; k < j; k++) {
            html += renderSingleMCQ(k + 1, mcq[k].structure as MCQStructure, true);
          }
          html += `</div>`;
          idx = j;
          continue;
        }
      }

      html += renderSingleMCQ(idx + 1, s, false);
      idx++;
    }
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
    font-family: 'Hind Siliguri', 'Inter', 'Roboto', 'Noto Sans Bengali', system-ui, sans-serif;
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

    // Add page numbers and branding
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // Page numbers (center)
      pdf.setFontSize(8);
      pdf.setTextColor('#999999');
      pdf.text(`${i} / ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Branding (bottom right)
      pdf.setFontSize(6);
      pdf.setTextColor('#cccccc'); // Light/Transparent looking
      pdf.text('Generated by QuestionCraft', pageWidth - 10, pageHeight - 5, { align: 'right' });
    }

    pdf.save(`${qs.examName || 'question-paper'}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
