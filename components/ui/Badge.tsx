import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "info"
  | "ghost"
  | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-zinc-800 text-zinc-300 border border-zinc-700",
  accent: "bg-indigo-950/60 text-indigo-300 border border-indigo-800/50",
  success: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40",
  warning: "bg-amber-950/60 text-amber-400 border border-amber-800/40",
  info: "bg-blue-950/60 text-blue-400 border border-blue-800/40",
  ghost: "bg-transparent text-zinc-400",
  outline: "border border-zinc-700 text-zinc-300 bg-transparent",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium font-mono tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
