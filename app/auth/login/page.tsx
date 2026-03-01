"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/store";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("বৈধ ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAppStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      if (authData.user) {
        setUser({ id: authData.user.id, email: authData.user.email! });
        toast({ title: "লগইন সফল!", description: "স্বাগতম!" });
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast({
        title: "লগইন ব্যর্থ",
        description: err.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-bengali text-gray-900 dark:text-white">বাংলা প্রশ্ন তৈরি</h1>
          <p className="text-muted-foreground font-bengali mt-1">সহজে বাংলা প্রশ্নপত্র তৈরি করুন</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="font-bengali text-xl text-center">লগইন করুন</CardTitle>
            <CardDescription className="font-bengali text-center">আপনার অ্যাকাউন্টে প্রবেশ করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bengali">ইমেইল</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-bengali">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="font-bengali">পাসওয়ার্ড</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500 font-bengali">{errors.password.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bengali h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> লগইন হচ্ছে...</>
                ) : (
                  "লগইন করুন"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground font-bengali">
                অ্যাকাউন্ট নেই?{" "}
                <Link href="/auth/register" className="text-emerald-600 hover:underline font-semibold">
                  নিবন্ধন করুন
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
