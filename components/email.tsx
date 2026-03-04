"use client";

import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

// Simple regex check for valid email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface EmailProps {  
  email: string,
  setEmail: Dispatch<SetStateAction<string>>,
  isLoading: boolean,
  isCreating: boolean,
  setSubmittable?: Dispatch<SetStateAction<boolean>>
}

export default function Email({ email, setEmail, isLoading, isCreating, setSubmittable }: EmailProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Only show validation feedback when creating a new account and field is focused
  const showValidation = isCreating && isFocused;
  const isValid = isValidEmail(email);

  // Apply green border for valid, red for invalid, neutral initially
  const borderClasses = showValidation && email.length > 0
    ? isValid
      ? "border-green-500 focus:ring-green-300"
      : "border-red-500 focus:ring-red-300"
    : "border-slate-200 focus:ring-slate-300";

  // Update validation state and parent form submission availability when email changes
  useEffect(() => {
    if (!isValid) {
      setErrorMessage("Please enter a valid email address.");
      setSubmittable?.(false);
    }
    else {
      setErrorMessage(null);
      setSubmittable?.(true);
    }
  }, [email]);

  return (
    <>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-slate-700 my-1.5"
      >
        Email
      </label>

      {/* Only show error message during validation if email is invalid */}
      {showValidation && email.length > 0 && errorMessage && 
        <p className="mb-1.5 text-sm text-red-600">{errorMessage}</p>
      }
      
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setIsFocused(true)}  // Track focus to show validation
        onBlur={() => setIsFocused(false)}
        required
        autoComplete="email"
        placeholder="you@example.com"
        disabled={isLoading}  // Disable while form is submitting
        className={`
          w-full 
          px-4 
          py-2.5 
          rounded-lg 
          border 
          bg-white 
          text-slate-800 
          placeholder:text-slate-400 
          focus:outline-none 
          focus:ring-2 
          focus:border-transparent 
          transition-shadow 
          disabled:opacity-60 
          disabled:cursor-not-allowed
          ${borderClasses}
        `}
      />
    </>
  );
}