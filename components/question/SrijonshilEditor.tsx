"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SrijonshilStructure } from "@/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  uddipok: z.string().optional().default(""),
  ko: z.object({ question: z.string().min(1, "প্রশ্ন দিন"), answer: z.string().optional().default("") }),
  kho: z.object({ question: z.string().min(1, "প্রশ্ন দিন"), answer: z.string().optional().default("") }),
  go: z.object({ question: z.string().min(1, "প্রশ্ন দিন"), answer: z.string().optional().default("") }),
  gho: z.object({ question: z.string().min(1, "প্রশ্ন দিন"), answer: z.string().optional().default("") }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  initialData?: SrijonshilStructure;
  onSave: (data: SrijonshilStructure) => void;
  onCancel: () => void;
  loading?: boolean;
}

const parts = [
  { key: "ko" as const, label: "ক) জ্ঞানমূলক প্রশ্ন", marks: "১ নম্বর" },
  { key: "kho" as const, label: "খ) অনুধাবনমূলক প্রশ্ন", marks: "২ নম্বর" },
  { key: "go" as const, label: "গ) প্রয়োগমূলক প্রশ্ন", marks: "৩ নম্বর" },
  { key: "gho" as const, label: "ঘ) উচ্চতর দক্ষতামূলক প্রশ্ন", marks: "৪ নম্বর" },
];

export default function SrijonshilEditor({ initialData, onSave, onCancel, loading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      uddipok: "",
      ko: { question: "", answer: "" },
      kho: { question: "", answer: "" },
      go: { question: "", answer: "" },
      gho: { question: "", answer: "" },
    },
  });

  return (
    <form onSubmit={handleSubmit(data => onSave(data as SrijonshilStructure))} className="space-y-4">
      <div>
        <Label className="bangla-font text-sm font-semibold">উদ্দীপক (ঐচ্ছিক)</Label>
        <Textarea
          {...register("uddipok")}
          placeholder="উদ্দীপকের পাঠ্যাংশ লিখুন..."
          className="mt-1 bangla-font min-h-[80px]"
        />
      </div>

      {parts.map(part => (
        <div key={part.key} className="border border-border rounded-lg p-4 bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <Label className="bangla-font font-semibold text-sm text-blue-700 dark:text-blue-400">{part.label}</Label>
            <span className="text-xs text-muted-foreground bangla-font">{part.marks}</span>
          </div>
          <div className="space-y-2">
            <div>
              <Label className="bangla-font text-xs text-muted-foreground">প্রশ্ন *</Label>
              <Input
                {...register(`${part.key}.question`)}
                placeholder="প্রশ্ন লিখুন..."
                className="mt-1 bangla-font"
              />
              {errors[part.key]?.question && (
                <p className="text-red-500 text-xs mt-1 bangla-font">{errors[part.key]?.question?.message}</p>
              )}
            </div>
            <div>
              <Label className="bangla-font text-xs text-muted-foreground">উত্তর (ঐচ্ছিক)</Label>
              <Textarea
                {...register(`${part.key}.answer`)}
                placeholder="উত্তর লিখুন..."
                className="mt-1 bangla-font min-h-[60px]"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="bangla-font">বাতিল</Button>
        <Button type="submit" disabled={loading} className="bangla-font">
          {loading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </Button>
      </div>
    </form>
  );
}
