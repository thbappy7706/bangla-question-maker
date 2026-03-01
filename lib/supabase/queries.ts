import { createClient } from "./client";

const supabase = createClient();
import type { QuestionSet, Question, QuestionType, QuestionStructure } from "@/types";

// Question Sets CRUD
export async function getQuestionSets(): Promise<QuestionSet[]> {
  const { data, error } = await supabase
    .from("question_sets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getQuestionSet(id: string): Promise<QuestionSet | null> {
  const { data, error } = await supabase
    .from("question_sets")
    .select("*, questions(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createQuestionSet(
  set: Omit<QuestionSet, "id" | "created_at" | "updated_at">
): Promise<QuestionSet> {
  const { data, error } = await supabase
    .from("question_sets")
    .insert(set)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateQuestionSet(
  id: string,
  updates: Partial<Omit<QuestionSet, "id" | "user_id" | "created_at">>
): Promise<QuestionSet> {
  const { data, error } = await supabase
    .from("question_sets")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuestionSet(id: string): Promise<void> {
  const { error } = await supabase.from("question_sets").delete().eq("id", id);
  if (error) throw error;
}

// Questions CRUD
export async function getQuestions(setId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("set_id", setId)
    .order("order_number", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createQuestion(question: {
  set_id: string;
  type: QuestionType;
  structure: QuestionStructure;
  order_number: number;
}): Promise<Question> {
  const { data, error } = await supabase
    .from("questions")
    .insert(question)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateQuestion(
  id: string,
  updates: Partial<Pick<Question, "structure" | "order_number">>
): Promise<Question> {
  const { data, error } = await supabase
    .from("questions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) throw error;
}
