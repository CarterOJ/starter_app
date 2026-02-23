"use client";

import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

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

  const showValidation = isCreating && isFocused;
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const borderClasses = showValidation && email.length > 0
    ? isValid
      ? "border-green-500 focus:ring-green-300"
      : "border-red-500 focus:ring-red-300"
    : "border-slate-200 focus:ring-slate-300";

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

      {showValidation && email.length > 0 && errorMessage && 
        <p className="mb-1.5 text-sm text-red-600">{errorMessage}</p>
      }
      
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required
        autoComplete="email"
        placeholder="you@example.com"
        disabled={isLoading}
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