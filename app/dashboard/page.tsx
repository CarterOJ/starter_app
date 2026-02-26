"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/spinner";

interface Profile {
  full_name: string | null;
  email: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          router.push("/auth/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error loading profile:", profileError);
          setProfile({ full_name: null, email: user.email || "" });
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  if (isLoading) {
    return (
      <div className="
        min-h-screen 
        flex 
        items-center 
        justify-center 
        bg-gradient-to-br 
        from-slate-50 
        via-slate-100 
        to-slate-200
      ">
        <Spinner size="lg" />
      </div>
    );
  }

  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "User";

  return (
    <div className="
      min-h-screen 
      bg-gradient-to-br 
      from-slate-50 
      via-slate-100 
      to-slate-200 
      px-4 
      py-8
    ">
      <div className="max-w-6xl mx-auto">
        <div className="
          bg-white/80 
          backdrop-blur-sm 
          rounded-2xl 
          shadow-xl 
          shadow-slate-200/50 
          border 
          border-slate-200/60 
          p-6 
          mb-8
        ">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
                Welcome back, {displayName}!
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Here's what's happening today
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="
                  flex items-center justify-center
                  w-12 h-12
                  rounded-full
                  bg-slate-800
                  text-white
                  font-medium
                  text-lg
                  hover:bg-slate-700
                  transition-colors
                  focus:outline-none
                  focus:ring-2
                  focus:ring-slate-500
                  focus:ring-offset-2
                "
                title="View Profile"
              >
                {displayName.charAt(0).toUpperCase()}
              </Link>

              <button
                onClick={handleLogout}
                className="
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
                  cursor-pointer
                "
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="
            bg-white/80 
            backdrop-blur-sm 
            rounded-2xl 
            shadow-xl 
            shadow-slate-200/50 
            border 
            border-slate-200/60 
            p-6
          ">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Getting Started
            </h2>
            <p className="text-slate-600 text-sm mb-4">
              Set up your profile to personalize your experience
            </p>
            <Link
              href="/profile"
              className="
                inline-block
                text-sm
                font-medium
                text-slate-700
                hover:text-slate-900
                underline
                underline-offset-2
                transition-colors
              "
            >
              Go to Profile →
            </Link>
          </div>

          <div className="
            bg-white/80 
            backdrop-blur-sm 
            rounded-2xl 
            shadow-xl 
            shadow-slate-200/50 
            border 
            border-slate-200/60 
            p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Your Account
            </h2>
            <p className="text-slate-600 text-sm mb-2">
              Email: <span className="text-slate-800">{profile?.email}</span>
            </p>
            <p className="text-slate-600 text-sm">
              Name: <span className="text-slate-800">{profile?.full_name || "Not set"}</span>
            </p>
          </div>

          <div className="
            bg-white/80 
            backdrop-blur-sm 
            rounded-2xl 
            shadow-xl 
            shadow-slate-200/50 
            border 
            border-slate-200/60 
            p-6
          ">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Link
                href="/profile"
                className="
                  block
                  text-sm
                  text-slate-700
                  hover:text-slate-900
                  transition-colors
                "
              >
                • Edit profile
              </Link>
              <button
                onClick={handleLogout}
                className="
                  block
                  text-sm
                  text-slate-700
                  hover:text-slate-900
                  transition-colors
                  text-left
                  cursor-pointer
                "
              >
                • Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}