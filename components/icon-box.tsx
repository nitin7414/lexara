"use client";

import { cn } from "@/lib/utils";

export type IconBoxContext = "streak" | "trophy" | "progress" | "warning" | "info";

interface IconBoxProps {
  context: IconBoxContext;
  icon?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CONTEXT_STYLES = {
  streak: {
    bg: "bg-[#7F77DD]",
    icon: "ti-flame",
  },
  trophy: {
    bg: "bg-[#BA7517]",
    icon: "ti-trophy",
  },
  progress: {
    bg: "bg-[#1D9E75]",
    icon: "ti-book-2",
  },
  warning: {
    bg: "bg-[#D85A30]",
    icon: "ti-alert-triangle",
  },
  info: {
    bg: "bg-[#534AB7]",
    icon: "ti-info-circle",
  },
};

export function IconBox({ context, icon, size = "md", className }: IconBoxProps) {
  const config = CONTEXT_STYLES[context];
  const finalIcon = icon || config.icon;

  const sizeClasses = {
    sm: "w-[28px] h-[28px] min-w-[28px] min-h-[28px] text-[14px]",
    md: "w-[36px] h-[36px] min-w-[36px] min-h-[36px] text-[18px]",
    lg: "w-[64px] h-[64px] min-w-[64px] min-h-[64px] text-[32px] rounded-[16px]", // 64x64 for streak page
  };

  return (
    <div
      style={{ borderRadius: size === "lg" ? "16px" : "10px" }}
      className={cn(
        "flex items-center justify-center text-white select-none shadow-none font-sans shrink-0",
        config.bg,
        sizeClasses[size],
        className
      )}
    >
      <i className={cn("ti leading-none", finalIcon)} />
    </div>
  );
}
