"use client";

import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

interface PasswordProps {
  showPassword: boolean, 
  setShowPassword: Dispatch<SetStateAction<boolean>>, 
  password: string, 
  setPassword: Dispatch<SetStateAction<string>>, 
  isLoading: boolean,
  isCreating: boolean,
  label: string
  setSubmittable?: Dispatch<SetStateAction<boolean>>
  reference?: string
}

export default function Password({ 
  showPassword, 
  setShowPassword, 
  password, 
  setPassword, 
  isLoading, 
  isCreating,
  label,
  setSubmittable,
  reference,
}: PasswordProps) { 
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showValidation = isCreating && isFocused;
  const isValidLength = password.length >= 8;
  const includesNumber = /\d/.test(password);
  const isReference = password === reference;

  const borderClasses = showValidation && password.length > 0
    ? (!reference || isReference) && isValidLength && includesNumber
      ? "border-green-500 focus:ring-green-300"
      : "border-red-500 focus:ring-red-300"
    : "border-slate-200 focus:ring-slate-300";

  useEffect(() => {
    if (reference && !isReference) {
      setErrorMessage("Passwords must match");
      setSubmittable?.(false)
    }
    else if (!isValidLength) {
      setErrorMessage("Password must be at least 8 characters");
      reference && setSubmittable?.(false)
    }
    else if (!includesNumber) {
      setErrorMessage("Password must include at least one number");
      reference &&setSubmittable?.(false)
    }
    else {
      reference && setSubmittable?.(true);
      setErrorMessage(null);
    }
  }, [password]);

  return (
    <>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-slate-700 my-1.5"
      >
        {label}
      </label>

      {showValidation && password.length > 0 && errorMessage && 
        <p className="mb-1.5 text-sm text-red-600">{errorMessage}</p>
      }
      
      <div className="relative">
        <input
          id={label}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isLoading}
          className={`
            w-full 
            px-4 
            py-2.5 
            pr-11 
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
            ${borderClasses}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          disabled={isLoading}
          className="
            absolute 
            right-2.5 
            top-1/2 
            -translate-y-1/2 
            p-1 
            rounded 
            text-slate-500 
            hover:text-slate-700 
            hover:bg-slate-100 
            focus:outline-none 
            focus:ring-2 
            focus:ring-slate-300 
            focus:ring-inset 
            disabled:opacity-60 
            disabled:cursor-not-allowed
            cursor-pointer
        "
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            {showPassword ? (
              <>
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </>
            ) : (
              <>
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="
                  M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 
                  10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" 
                />
                <path d="
                  M6.61 6.61A13.526 13.526 0 0 0 2 12s3 
                  7 10 7a9.74 9.74 0 0 0 5.39-1.61" 
                />
                <line x1="2" x2="22" y1="2" y2="22" />
              </>
            )}
          </svg>
        </button>
      </div>
    </>
  );
}