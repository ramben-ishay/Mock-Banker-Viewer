"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap: Record<"sm" | "md" | "lg", string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

export function Avatar({
  initials,
  color,
  size = "md",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold text-white flex-shrink-0 border border-black/5",
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: color || "#d04aff" }}
    >
      {initials}
    </div>
  );
}
