"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  name?: string | null;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ name, imageUrl, size = "md", className }: AvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "LX";

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-20 h-20 text-2xl font-bold",
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name || "User avatar"}
        className={cn(
          "rounded-full object-cover border border-outline-variant/30 dark:border-outline-variant/50 shadow-xs",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold select-none border border-outline-variant/30 dark:border-outline-variant/50 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim shadow-none",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
