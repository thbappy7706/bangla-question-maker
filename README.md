# QuestionCraft — বাংলা প্রশ্নপত্র তৈরির অ্যাপ

> 📱 Mobile-first Bangla exam question paper creator — **installable PWA** with full offline support.

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

- **📲 Progressive Web App (PWA)**
  - Installable on Android, iOS, and Desktop
  - Works fully **offline** after first load
  - Automatic update notifications
  - Home screen icon with custom branding
  - Fast loading from cache

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
| **vite-plugin-pwa** | PWA / Service Worker / Manifest |
| **gh-pages** | GitHub Pages deploy |

---

## 📲 PWA — Progressive Web App

QuestionCraft is fully installable as a **Progressive Web App** on all platforms.

### ✅ PWA Features

| Feature | Details |
|---------|--------|
| **Offline Support** | All assets pre-cached by Workbox on first load |
| **Installable** | Add to home screen on Android, iOS, and Desktop Chrome |
| **Auto Update** | Update toast appears when a new version is deployed |
| **App Icons** | 8 icon sizes (72px → 512px) including maskable icons |
| **Splash Screen** | Themed launch screen with emerald branding |
| **Standalone Mode** | Runs like a native app, no browser chrome |
| **Font Caching** | Google Fonts (Hind Siliguri) cached for 1 year |

### 📲 How to Install

**Android (Chrome):**
1. Open the [Live Demo](https://thbappy7706.github.io/bangla-question-maker) in Chrome
2. Tap the `⋮` menu → **"Add to Home screen"**
3. Or tap the install banner that appears automatically

**iPhone / iPad (Safari):**
1. Open the link in Safari
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"** → **Add**

**Desktop (Chrome / Edge):**
1. Visit the site
2. Click the **install icon** in the address bar (`⊕`)
3. Click **Install**

### ⚙️ PWA Architecture

```
public/
├── icons/
│   ├── icon-72x72.png    # App icons (all sizes)
│   ├── icon-192x192.png  # Required for Android install
│   ├── icon-512x512.png  # Required for splash screen
│   ├── screenshot-wide.png     # Desktop screenshots
│   └── screenshot-mobile.png   # Mobile screenshots
└── apple-touch-icon.png  # iOS home screen icon

src/
└── components/
    └── PWAPrompt.tsx     # Update toast + Install banner

vite.config.ts            # VitePWA plugin config (manifest + Workbox)
```

### 🔄 Service Worker Strategy

| Resource | Strategy | Cache Duration |
|----------|----------|----------------|
| App JS/CSS/HTML | **Pre-cache** | Indefinite (versioned) |
| Google Fonts CSS | **CacheFirst** | 1 year |
| Google Fonts Files | **CacheFirst** | 1 year |

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
