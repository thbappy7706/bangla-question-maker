# বাংলা প্রশ্ন মেকার | Bangla Question Maker

> 📱 Mobile-first Bangla exam question paper creator — works fully offline with localStorage.

**Live Demo:** https://thbappy7706.github.io/bangla-question-maker

---

## ✨ Features

- **3 Question Types**
  - 📖 সৃজনশীল (Srijonshil) — Uddipok + ক/খ/গ/ঘ parts
  - ✏️ সংক্ষিপ্ত (Songkhipto) — Short Q&A
  - 🔘 বহুনির্বাচনী MCQ — 4-option multiple choice

- **Export**
  - 📄 PDF export (jsPDF)
  - 📝 Word (.docx) export

- **Mobile-First Design**
  - Bottom sheet dialogs (native feel)
  - Safe area support (iPhone notch/home bar)
  - Touch-optimized inputs (no iOS zoom)
  - Floating action button (FAB)

- **No Backend Needed**
  - All data saved in localStorage via Zustand persist
  - Works fully offline

---

## 🚀 Quick Start

```bash
git clone https://github.com/thbappy7706/bangla-question-maker.git
cd bangla-question-maker
npm install
npm run dev
```

## 📦 Build & Deploy

```bash
# Build
npm run build

# Deploy to GitHub Pages (one command)
npm run deploy
```

Or push to `main` branch — GitHub Actions auto-deploys.

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| **Vite + React 19** | Fast build, instant HMR |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Mobile-first styling |
| **Zustand + persist** | State + localStorage |
| **React Hook Form + Zod** | Form validation |
| **jsPDF** | PDF export |
| **docx + file-saver** | Word export |
| **gh-pages** | GitHub Pages deploy |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Button, Input, BottomSheet, Badge...
│   └── question/     # SrijonshilEditor, MCQEditor, QuestionCard, FAB
├── pages/
│   ├── Dashboard.tsx # Question sets list
│   └── Editor.tsx    # Question editor
├── store/
│   └── index.ts      # Zustand store (localStorage)
├── lib/
│   └── export/       # pdf.ts, docx.ts
└── types/
    └── index.ts      # TypeScript types
```

---

## 📝 Data Structures (localStorage)

```typescript
// Question Set
{ id, institution, examName, className, subjectName, fullMarks, duration, note, createdAt, updatedAt }

// Srijonshil
{ uddipok, ko: { question, answer }, kho, go, gho }

// Songkhipto
{ question, answer }

// MCQ
{ question, options: [string, string, string, string], correctAnswer: 0|1|2|3 }
```

---

## 📄 License

MIT
