"use client";

import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";
type ButtonSize = "xsm" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-800 focus-visible:ring-brand-300",
  secondary:
    "bg-neutral-000 border border-neutral-300 text-neutral-950 hover:border-neutral-500 active:bg-neutral-100",
  tertiary:
    "bg-transparent text-neutral-950 hover:bg-neutral-100 active:bg-neutral-200",
  destructive:
    "bg-status-red-700 text-white hover:bg-[#a7165c] active:bg-[#8e124d]",
};

const sizeStyles: Record<ButtonSize, string> = {
  xsm: "h-6 px-1 text-sm rounded-xsm font-normal",
  sm: "h-8 px-2 text-base rounded-cta font-normal",
  md: "h-10 px-3 text-base font-semibold rounded-cta",
  lg: "h-12 px-4 text-lg font-semibold rounded-cta",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-[var(--font-body)] transition-all duration-200 cursor-pointer focus-ring",
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-70 bg-neutral-400 text-neutral-500 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
