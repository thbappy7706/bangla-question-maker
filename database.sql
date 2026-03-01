-- Bangla Question Maker - Database Schema
-- Run this in your Supabase SQL Editor

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
