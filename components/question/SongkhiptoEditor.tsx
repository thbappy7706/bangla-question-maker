"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SongkhiptoStructure } from "@/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const schema = z.object({
  question: z.string().min(1, "প্রশ্ন দিন"),
  answer: z.string().optional().default(""),
});

type FormData = z.infer<typeof schema>;

interface Props {
  initialData?: SongkhiptoStructure;
  onSave: (data: SongkhiptoStructure) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function SongkhiptoEditor({ initialData, onSave, onCancel, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { question: "", answer: "" },
  });

  return (
    <form onSubmit={handleSubmit(data => onSave(data as SongkhiptoStructure))} className="space-y-4">
      <div>
        <Label className="bangla-font font-semibold">প্রশ্ন *</Label>
        <Textarea
          {...register("question")}
          placeholder="সংক্ষিপ্ত প্রশ্ন লিখুন..."
          className="mt-1 bangla-font min-h-[80px]"
        />
        {errors.question && <p className="text-red-500 text-xs mt-1 bangla-font">{errors.question.message}</p>}
      </div>

      <div>
        <Label className="bangla-font font-semibold">উত্তর (ঐচ্ছিক)</Label>
        <Textarea
          {...register("answer")}
          placeholder="উত্তর লিখুন..."
          className="mt-1 bangla-font min-h-[100px]"
        />
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
