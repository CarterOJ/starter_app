import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
              Starter App
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Welcome! Get started by signing in or exploring your dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 border border-slate-200/60 px-4 py-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Authentication status
              </p>
              <p className="text-sm text-slate-800">
                {user ? (
                  <>
                    Signed in as <span className="font-medium">{user.email}</span>
                  </>
                ) : (
                  "Not signed in"
                )}
              </p>
            </div>

            {user ? (
              <Link
                href="/dashboard"
                className="block w-full py-2.5 px-4 rounded-lg bg-slate-800 text-white font-medium text-sm text-center hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                Go to dashboard
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="block w-full py-2.5 px-4 rounded-lg bg-slate-800 text-white font-medium text-sm text-center hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
