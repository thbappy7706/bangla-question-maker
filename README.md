# 📝 বাংলা প্রশ্ন মেকার (Bangla Question Maker)

A production-ready web application for creating Bengali exam question papers with three question types: Srijonshil, Songkhipto, and MCQ.

## 🚀 Features

- **3 Question Types:**
  - সৃজনশীল (Srijonshil) - Creative questions with Uddipok and 4 sub-parts (ক, খ, গ, ঘ)
  - সংক্ষিপ্ত (Songkhipto) - Short answer questions
  - বহুনির্বাচনী (MCQ) - Multiple choice with 4 options

- **Export Options:** PDF and Word (.docx) export
- **Authentication:** Supabase Auth (email/password)
- **Dark/Light Theme**
- **GitHub Pages Compatible** (static export)

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, Static Export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand
- **Backend:** Supabase (Auth + PostgreSQL)
- **Forms:** React Hook Form + Zod
- **Export:** jsPDF, docx, file-saver

## 📦 Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/bangla-question-maker.git
cd bangla-question-maker
npm install
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run this schema:

```sql
create extension if not exists "uuid-ossp";

create table question_sets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  institution text,
  exam_name text,
  class_name text,
  subject_name text,
  full_marks integer,
  duration integer,
  note text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table questions (
  id uuid primary key default uuid_generate_v4(),
  set_id uuid references question_sets(id) on delete cascade,
  type text not null,
  structure jsonb not null,
  order_number integer default 0,
  created_at timestamp with time zone default now()
);

alter table question_sets enable row level security;
alter table questions enable row level security;

create policy "Users own sets"
  on question_sets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users own questions"
  on questions
  for all
  using (
    exists (
      select 1 from question_sets
      where question_sets.id = questions.set_id
      and question_sets.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from question_sets
      where question_sets.id = questions.set_id
      and question_sets.user_id = auth.uid()
    )
  );
```

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_PATH=
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 GitHub Pages Deployment

### 1. Build Static Export

```bash
npm run build
```

This generates the `out/` directory.

### 2. Deploy to GitHub Pages

```bash
# Option 1: Use gh-pages
npm install -g gh-pages
gh-pages -d out

# Option 2: Push to gh-pages branch manually
git add out -f
git commit -m "Deploy"
git subtree push --prefix out origin gh-pages
```

### 3. Set Base Path (if repo is not at root)

In `.env.local`:
```env
NEXT_PUBLIC_BASE_PATH=/your-repo-name
```

## 📁 Project Structure

```
bangla-question-maker/
├── app/
│   ├── auth/         # Login/Register page
│   ├── dashboard/    # Question sets list
│   ├── editor/[id]/  # Question editor
│   └── layout.tsx
├── components/
│   ├── layout/       # Navbar, ThemeProvider
│   ├── question/     # Question editors & cards
│   └── ui/           # shadcn/ui components
├── lib/
│   ├── export/       # PDF & Word export
│   └── supabase/     # Supabase client
├── store/            # Zustand store
└── types/            # TypeScript types
```

## 📝 Question Data Structures

### Srijonshil
```json
{
  "uddipok": "উদ্দীপকের পাঠ্যাংশ",
  "ko": { "question": "জ্ঞানমূলক প্রশ্ন", "answer": "উত্তর" },
  "kho": { "question": "অনুধাবনমূলক প্রশ্ন", "answer": "উত্তর" },
  "go": { "question": "প্রয়োগমূলক প্রশ্ন", "answer": "উত্তর" },
  "gho": { "question": "উচ্চতর দক্ষতামূলক প্রশ্ন", "answer": "উত্তর" }
}
```

### Songkhipto
```json
{
  "question": "প্রশ্ন",
  "answer": "উত্তর"
}
```

### MCQ
```json
{
  "question": "প্রশ্ন",
  "options": ["বিকল্প ১", "বিকল্প ২", "বিকল্প ৩", "বিকল্প ৪"],
  "correctAnswer": 0
}
```

## 🔐 Authentication

Uses Supabase email/password authentication. Each user can only see and manage their own question sets (Row Level Security).

## 📄 License

MIT
