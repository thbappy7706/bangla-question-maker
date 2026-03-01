"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("বৈধ ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"),
});
type FormData = z.infer<typeof schema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword(data);
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp(data);
        if (error) throw error;
        setError("নিবন্ধন সম্পন্ন! ইমেইল যাচাই করুন।");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "কোনো সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📝</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white bangla-font">
              বাংলা প্রশ্ন মেকার
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 bangla-font text-sm">
              পেশাদার বাংলা প্রশ্নপত্র তৈরি করুন
            </p>
          </div>

          <div className="flex rounded-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium bangla-font transition-colors ${isLogin ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
            >
              লগইন
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium bangla-font transition-colors ${!isLogin ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
            >
              নিবন্ধন
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 bangla-font">
                ইমেইল
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 bangla-font">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 bangla-font">
                পাসওয়ার্ড
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 bangla-font">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm bangla-font">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium bangla-font transition-colors"
            >
              {loading ? "অপেক্ষা করুন..." : isLogin ? "লগইন করুন" : "নিবন্ধন করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
