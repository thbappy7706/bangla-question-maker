-- Bangla Question Maker - Supabase Database Schema
-- Run this in your Supabase SQL editor

create extension if not exists "uuid-ossp";

-- Question Sets Table
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

-- Questions Table
create table questions (
  id uuid primary key default uuid_generate_v4(),
  set_id uuid references question_sets(id) on delete cascade,
  type text not null,
  structure jsonb not null,
  order_number integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table question_sets enable row level security;
alter table questions enable row level security;

-- RLS Policies
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

-- Updated at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger update_question_sets_updated_at
  before update on question_sets
  for each row
  execute procedure update_updated_at_column();
