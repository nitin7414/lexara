"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: string;
  className?: string;
}

export function StatCard({ value, label, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-primary-light/40 border border-primary-light p-4 rounded-xl flex flex-col justify-between select-none min-h-[100px]",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <i className={cn("ti text-primary text-lg leading-none", icon)} />
        )}
      </div>
      <div className="text-2xl font-black text-primary-dark dark:text-primary-light mt-2">
        {value}
      </div>
    </div>
  );
}
