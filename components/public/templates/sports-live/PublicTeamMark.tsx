import type { CSSProperties } from "react";
import { getInitials } from "./match-utils";

export function PublicTeamMark({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--public-border)] bg-[var(--public-surface)]">
        <img src={logoUrl} alt={`Logo de ${name}`} className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--public-border)] bg-[var(--public-surface-muted)] text-sm font-black text-[var(--public-text-muted)]">
      {getInitials(name)}
    </span>
  );
}

export function PublicKitColorDot({ color }: { color: string | null }) {
  if (!color) {
    return (
      <span className="h-4 w-4 shrink-0 rounded-full border border-dashed border-[var(--public-text-soft)] bg-[var(--public-surface)]" />
    );
  }

  return (
    <span
      className="h-4 w-4 shrink-0 rounded-full border border-black/15 shadow-sm"
      style={{ backgroundColor: color } as CSSProperties}
    />
  );
}
