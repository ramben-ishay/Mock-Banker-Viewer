"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "green" | "orange" | "red" | "blue" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-status-green-100 text-status-green-700",
  orange: "bg-status-orange-100 text-status-orange-700",
  red: "bg-status-red-100 text-status-red-700",
  blue: "bg-status-blue-100 text-status-blue-700",
  neutral: "bg-neutral-200 text-neutral-800",
};

const sizeStyles: Record<"sm" | "md", string> = {
  sm: "h-5 text-[10px] px-1.5",
  md: "h-6 text-xs px-2",
};

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xsm font-bold whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
  variant?: BadgeVariant;
}

export function Tag({ children, onRemove, className, variant = "neutral" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-6 px-2 bg-neutral-200 text-neutral-800 text-xs rounded-xsm transition-colors hover:bg-neutral-300",
        variant !== "neutral" && variantStyles[variant],
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 text-neutral-600 hover:text-neutral-950 cursor-pointer transition-colors"
        >
          &times;
        </button>
      )}
    </span>
  );
}
