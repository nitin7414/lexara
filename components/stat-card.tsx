"use client";

import { cn } from "@/lib/utils";
import { IconBox, IconBoxContext } from "./icon-box";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: string;
  context?: IconBoxContext;
  className?: string;
}

export function StatCard({ value, label, icon, context, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-lexara-100 dark:bg-lexara-dark-elevated p-4 rounded-xl flex flex-col justify-between select-none min-h-[102px]",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-bold text-lexara-600 dark:text-lexara-400 uppercase tracking-wider">
          {label}
        </span>
        {context && (
          <IconBox context={context} icon={icon} size="sm" />
        )}
      </div>
      <div className="text-xl font-black text-lexara-900 dark:text-lexara-200 mt-2">
        {value}
      </div>
    </div>
  );
}
