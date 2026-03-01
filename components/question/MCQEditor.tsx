"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MCQStructure } from "@/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  question: z.string().min(1, "প্রশ্ন দিন"),
  options: z.tuple([
    z.string().min(1, "বিকল্প দিন"),
    z.string().min(1, "বিকল্প দিন"),
    z.string().min(1, "বিকল্প দিন"),
    z.string().min(1, "বিকল্প দিন"),
  ]),
  correctAnswer: z.number().min(0).max(3),
});

type FormData = z.infer<typeof schema>;

interface Props {
  initialData?: MCQStructure;
  onSave: (data: MCQStructure) => void;
  onCancel: () => void;
  loading?: boolean;
}

const optionLabels = ["ক", "খ", "গ", "ঘ"];

export default function MCQEditor({ initialData, onSave, onCancel, loading }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  });

  const correctAnswer = watch("correctAnswer");

  return (
    <form onSubmit={handleSubmit(data => onSave(data as MCQStructure))} className="space-y-4">
      <div>
        <Label className="bangla-font font-semibold">প্রশ্ন *</Label>
        <Textarea
          {...register("question")}
          placeholder="বহুনির্বাচনী প্রশ্ন লিখুন..."
          className="mt-1 bangla-font min-h-[80px]"
        />
        {errors.question && <p className="text-red-500 text-xs mt-1 bangla-font">{errors.question.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="bangla-font font-semibold">বিকল্পসমূহ *</Label>
        <p className="text-xs text-muted-foreground bangla-font">সঠিক উত্তরে ক্লিক করে নির্বাচন করুন</p>
        {optionLabels.map((label, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setValue("correctAnswer", idx)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold bangla-font flex-shrink-0 transition-colors ${
                correctAnswer === idx
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 text-gray-600 hover:border-blue-400"
              }`}
            >
              {label}
            </button>
            <Input
              {...register(`options.${idx}` as `options.${0 | 1 | 2 | 3}`)}
              placeholder={`${label}) বিকল্প লিখুন...`}
              className="bangla-font flex-1"
            />
          </div>
        ))}
        {errors.options && <p className="text-red-500 text-xs bangla-font">সব বিকল্প পূরণ করুন</p>}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} className="bangla-font">বাতিল</Button>
        <Button type="submit" disabled={loading} className="bangla-font">
          {loading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </Button>
      </div>
    </form>
  );
}
