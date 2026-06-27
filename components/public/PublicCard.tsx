import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type PublicCardProps = {
  children: ReactNode;
  className?: string;
};

export function PublicCard({ children, className }: PublicCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[var(--public-border)] bg-[var(--public-surface)] p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
