import Link from "next/link";
import { CalendarDays, Shield, Trophy, Users } from "lucide-react";

type QuickLink = {
  href: string;
  label: string;
  icon: typeof CalendarDays;
};

type QuickLinksProps = {
  clubSlug: string;
  showCalendario: boolean;
  showSocios: boolean;
  showTransparencia: boolean;
  showTienda: boolean;
};

export function QuickLinks({ clubSlug, showCalendario, showSocios, showTransparencia, showTienda }: QuickLinksProps) {
  const links: QuickLink[] = [];

  if (showCalendario) {
    links.push({
      href: `/${clubSlug}/calendario`,
      label: "Calendario",
      icon: CalendarDays,
    });
  }

  if (showSocios) {
    links.push({
      href: `/${clubSlug}/socios`,
      label: "Socios",
      icon: Users,
    });
  }

  if (showTransparencia) {
    links.push({
      href: `/${clubSlug}/transparencia`,
      label: "Transparencia",
      icon: Shield,
    });
  }

  if (showTienda) {
    links.push({
      href: `/${clubSlug}/tienda`,
      label: "Tienda",
      icon: Trophy,
    });
  }

  if (links.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-w-0 items-center gap-3 rounded-2xl bg-[var(--public-surface)] p-4 text-sm font-bold text-[var(--public-text)] shadow-sm ring-1 ring-[var(--public-border)] transition hover:opacity-85"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tenant-accent)]/15 text-[var(--tenant-primary)]">
              <Icon size={18} />
            </span>

            <span className="min-w-0 truncate">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
