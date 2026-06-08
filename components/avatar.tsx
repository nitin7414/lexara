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
    const isSprite = imageUrl.includes("#sprite");
    if (isSprite) {
      const hash = imageUrl.split("#")[1];
      const parts = hash?.split("-");
      if (parts && parts[0] === "sprite") {
        const col = parseInt(parts[1]) || 0;
        const row = parseInt(parts[2]) || 0;

        return (
          <div
            className={cn(
              "rounded-full overflow-hidden border border-outline-variant/30 dark:border-outline-variant/50 shadow-xs relative flex items-center justify-center bg-surface-container-high",
              sizeClasses[size],
              className
            )}
          >
            <img
              src={imageUrl.split("#")[0]}
              alt={name || "User avatar"}
              className="max-w-none absolute"
              style={{
                width: "600%",
                height: "500%",
                left: 0,
                top: 0,
                objectPosition: `${col * 20}% ${row * 25}%`,
              }}
            />
          </div>
        );
      }
    }

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
