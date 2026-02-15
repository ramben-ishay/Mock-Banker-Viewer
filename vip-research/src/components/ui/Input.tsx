"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export function Input({
  label,
  error,
  success,
  className,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-bold text-neutral-950 font-[family-name:var(--font-body)]">
          {label}
        </label>
      )}
      <input
        className={cn(
          "h-10 px-3 bg-white border border-neutral-300 rounded-cta text-neutral-950 placeholder-neutral-500 transition-all duration-200 outline-none",
          "hover:border-neutral-500",
          "focus:border-brand-300 focus:ring-0",
          error && "border-status-red-700 focus:border-status-red-700",
          success && "border-status-green-700 focus:border-status-green-700",
          props.disabled && "bg-neutral-400 border-neutral-400 text-neutral-500 cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-status-red-700">{error}</span>
      )}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-bold text-neutral-950 font-[family-name:var(--font-body)]">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "min-h-[100px] px-3 py-2 bg-white border border-neutral-300 rounded-cta text-neutral-950 placeholder-neutral-500 transition-all duration-200 outline-none resize-y",
          "hover:border-neutral-500",
          "focus:border-brand-300 focus:ring-0",
          error && "border-status-red-700 focus:border-status-red-700",
          props.disabled && "bg-neutral-400 border-neutral-400 text-neutral-500 cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-status-red-700">{error}</span>
      )}
    </div>
  );
}
