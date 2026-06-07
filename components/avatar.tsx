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

  // Generate a premium pastel HSL background color deterministically from name
  const getBackgroundColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 65%, 60%)`; // Premium balanced pastel shade
  };

  const bgColor = name ? getBackgroundColor(name) : "#7F77DD";

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
          "rounded-full object-cover border-2 border-white",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={cn(
        "rounded-full flex items-center justify-center text-white border-2 border-white font-medium select-none shadow-none",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
