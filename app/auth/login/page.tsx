"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Password from "@/components/password";
import Email from "@/components/email";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="
      min-h-screen 
      flex items-center 
      justify-center 
      bg-gradient-to-br 
      from-slate-50 
      via-slate-100 
      to-slate-200 px-4
    ">
      <div className="w-full max-w-md">
        <div className="
          bg-white/80 
          backdrop-blur-sm 
          rounded-2xl 
          shadow-xl 
          shadow-slate-200/50 
          border 
          border-slate-200/60 
          p-8
        ">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="
                  rounded-lg 
                  bg-red-50 
                  border 
                  border-red-100 
                  px-4 
                  py-3 
                  text-sm 
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            <Email 
              email={email} 
              setEmail={setEmail} 
              isLoading={isLoading} 
              isCreating={false} 
            />

            <Password 
              showPassword={showPassword} 
              setShowPassword={setShowPassword} 
              password={password} 
              setPassword={setPassword} 
              isLoading={isLoading} 
              isCreating={false}
              label="Password"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full 
                py-2.5 
                px-4 
                rounded-lg 
                bg-slate-800 
                text-white 
                font-medium 
                text-sm 
                hover:bg-slate-700 
                focus:outline-none 
                focus:ring-2 
                focus:ring-slate-500 
                focus:ring-offset-2 
                transition-colors 
                disabled:opacity-60 
                disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="
                font-medium 
                text-slate-700 
                hover:text-slate-900 
                underline 
                underline-offset-2 
                transition-colors
              "
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
