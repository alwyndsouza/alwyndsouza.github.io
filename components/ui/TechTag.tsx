import { cn } from "@/lib/utils";

interface TechTagProps {
  label: string;
  className?: string;
}

export function TechTag({ label, className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono font-medium",
        "bg-zinc-800/80 text-zinc-400 border border-zinc-700/50",
        className
      )}
    >
      {label}
    </span>
  );
}
