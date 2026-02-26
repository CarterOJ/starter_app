"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/spinner";
import Image from "next/image";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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
          .select("id, full_name, email, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error loading profile:", profileError);
          setProfile({ id: user.id, full_name: null, email: user.email || "", avatar_url: null });
          setEditName("");
        } else {
          setProfile(profileData);
          setEditName(profileData.full_name || "");
          if (profileData.avatar_url) {
            setAvatarPreview(profileData.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleNameUpdate(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!editName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (editName.trim().length > 100) {
      setError("Name must be less than 100 characters");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: editName.trim() })
        .eq("id", profile?.id);

      if (updateError) {
        setError("Failed to update name");
        return;
      }

      if (profile) {
        setProfile({ ...profile, full_name: editName.trim() });
      }
      setSuccessMessage("Name updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const supabase = createClient();

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const fileExt = file.name.split(".").pop();
      const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split("/").pop();
        if (oldPath) {
          await supabase.storage.from("profiles").remove([`avatars/${oldPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq("id", profile?.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (profile) {
        setProfile({ ...profile, avatar_url: publicUrlData.publicUrl });
      }
      setSuccessMessage("Avatar updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError("Failed to upload avatar. Please try again.");
      setAvatarPreview(profile?.avatar_url || null);
    } finally {
      setIsUploading(false);
    }
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
      <div className="max-w-2xl mx-auto">

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
          <Link
            href="/dashboard"
            className="
              text-sm 
              text-slate-500 
              hover:text-slate-700 
              transition-colors 
              mb-4 
              inline-block
            "
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">
            Profile
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage your account information
          </p>
        </div>

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
              mb-6
            "
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            role="alert"
            className="
              rounded-lg
              bg-green-50
              border
              border-green-100
              px-4
              py-3
              text-sm
              text-green-700
              mb-6
            "
          >
            {successMessage}
          </div>
        )}

        <div className="
          bg-white/80 
          backdrop-blur-sm 
          rounded-2xl 
          shadow-xl 
          shadow-slate-200/50 
          border 
          border-slate-200/60 
          p-6 
          mb-6
        ">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Profile Picture
          </h2>

          <div className="flex flex-col items-center">
            <div className="mb-6">
              {avatarPreview ? (
                <div className="
                  relative 
                  w-24 
                  h-24 
                  rounded-full 
                  overflow-hidden 
                  border-4 
                  border-slate-200 
                  shadow-lg
                ">
                  <Image
                    src={avatarPreview}
                    alt={displayName}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              ) : (
                <div className="
                  w-24 h-24
                  rounded-full
                  bg-slate-800
                  text-white
                  font-semibold
                  text-2xl
                  flex
                  items-center
                  justify-center
                  border-4
                  border-slate-200
                  shadow-lg
                ">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="avatar-input"
                className="
                  block
                  cursor-pointer
                  text-center
                  py-3
                  px-4
                  rounded-lg
                  bg-slate-100
                  text-slate-700
                  font-medium
                  text-sm
                  hover:bg-slate-200
                  transition-colors
                  border
                  border-slate-200
                "
              >
                {isUploading ? "Uploading..." : "Choose Image"}
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploading}
                className="hidden"
              />
            </div>

            <p className="text-xs text-slate-500 mt-3 text-center">
              JPG, PNG, or GIF • Max 5MB
            </p>
          </div>
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
          mb-6
        ">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Personal Information
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="
              w-full
              px-4
              py-2.5
              rounded-lg
              bg-slate-50
              border
              border-slate-200
              text-slate-700
              text-sm
            ">
              {profile?.email}
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Email cannot be changed
            </p>
          </div>

          <form onSubmit={handleNameUpdate}>
            <div className="mb-6">
              <label htmlFor="full-name" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={isSaving}
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-lg
                  bg-white
                  border
                  border-slate-200
                  text-slate-900
                  text-sm
                  placeholder:text-slate-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-slate-500
                  focus:ring-offset-2
                  transition-colors
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
                placeholder="Enter your full name"
                maxLength={100}
              />
              <p className="text-xs text-slate-500 mt-1.5">
                {editName.length}/100 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving || editName === profile?.full_name}
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
              "
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
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
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Account
          </h2>
          <Link
            href="/dashboard"
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
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}