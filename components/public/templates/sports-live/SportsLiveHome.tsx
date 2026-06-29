import type { ComponentProps, CSSProperties } from "react";
import Link from "next/link";
import { PublicClubNav } from "@/components/public/PublicClubNav";
import { PublicCard } from "@/components/public/PublicCard";
import type { PublicCalendarEvent } from "@/server/queries/get-public-calendar-events";
import { NextMatchCard } from "./NextMatchCard";
import { QuickLinks } from "./QuickLinks";
import { RecentMatchCard } from "./RecentMatchCard";
import { SportsHero } from "./SportsHero";

type SportsLiveHomeProps = {
  club: {
    id: string;
    name: string;
    slug: string;
  };
  settings: {
    public_name: string;
    logo_url: string | null;
    cover_image_url: string | null;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
  enabledModules: ComponentProps<typeof PublicClubNav>["modules"];
  events: PublicCalendarEvent[];
};

export function SportsLiveHome({ club, settings, enabledModules, events }: SportsLiveHomeProps) {
  const publicMatches = events.filter((event) => event.event_type === "match" && event.match_details);

  const now = new Date();

  const nextMatch =
    publicMatches.find((event) => {
      return event.status !== "completed" && event.status !== "cancelled" && new Date(event.starts_at) >= now;
    }) ?? null;

  const recentMatches = publicMatches
    .filter((event) => {
      return event.status === "completed" || event.status === "cancelled" || new Date(event.starts_at) < now;
    })
    .reverse()
    .slice(0, 3);

  const themeStyle = {
    "--tenant-primary": settings.primary_color,
    "--tenant-secondary": settings.secondary_color,
    "--tenant-accent": settings.accent_color,

    "--public-bg": "#f5f7f4",
    "--public-surface": "#ffffff",
    "--public-surface-muted": "#eef2ef",
    "--public-border": "#e5e7eb",
    "--public-text": "#111827",
    "--public-text-muted": "#6b7280",
    "--public-text-soft": "#9ca3af",

    "--public-success-bg": "#dcfce7",
    "--public-success-text": "#15803d",
    "--public-danger-bg": "#fee2e2",
    "--public-danger-text": "#b91c1c",
    "--public-neutral-bg": "#e5e7eb",
    "--public-neutral-text": "#374151",
  } as CSSProperties;

  const hasSocios = enabledModules.some((item) => item.module === "socios");
  const hasCalendario = enabledModules.some((item) => item.module === "calendario");
  const hasTransparencia = enabledModules.some((item) => item.module === "transparencia");
  const hasTienda = enabledModules.some((item) => item.module === "tienda");

  return (
    <main style={themeStyle} className="min-h-dvh overflow-x-hidden bg-[var(--public-bg)] text-[var(--public-text)]">
      <PublicClubNav clubSlug={club.slug} modules={enabledModules} />

      <SportsHero
        clubSlug={club.slug}
        publicName={settings.public_name}
        logoUrl={settings.logo_url}
        coverImageUrl={settings.cover_image_url}
        showSocios={hasSocios}
        showCalendario={hasCalendario}
      />

      <section className="px-3 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <SectionHeader title="Resultados recientes" description="Últimos partidos publicados por el club." />

            {recentMatches.length === 0 ? (
              <PublicCard>
                <p className="text-sm text-[var(--public-text-muted)]">Todavía no hay resultados publicados.</p>
              </PublicCard>
            ) : (
              <div className="space-y-3">
                {recentMatches.map((event) => (
                  <RecentMatchCard key={event.id} event={event} clubName={club.name} clubLogoUrl={settings.logo_url} />
                ))}
              </div>
            )}

            {hasCalendario ? (
              <Link
                href={`/${club.slug}/calendario`}
                className="flex min-h-12 items-center justify-center rounded-2xl bg-[var(--public-surface-muted)] px-5 text-sm font-bold text-[var(--public-text)] transition hover:opacity-85"
              >
                Ver todos los partidos
              </Link>
            ) : null}
          </div>

          <div className="space-y-8">
            <SectionHeader title="Próximo partido" description="El siguiente encuentro programado." />

            {nextMatch ? (
              <NextMatchCard event={nextMatch} clubName={club.name} clubLogoUrl={settings.logo_url} />
            ) : (
              <PublicCard>
                <p className="text-sm text-[var(--public-text-muted)]">Todavía no hay próximos partidos publicados.</p>
              </PublicCard>
            )}

            <QuickLinks
              clubSlug={club.slug}
              showCalendario={hasCalendario}
              showSocios={hasSocios}
              showTransparencia={hasTransparencia}
              showTienda={hasTienda}
            />
          </div>
        </div>
      </section>

      <section className="px-3 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <PublicCard>
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-2xl font-black text-[var(--public-text)]">Únete a nuestra comunidad</h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--public-text-muted)]">
                  Participa como jugador, socio, voluntario o colaborador. El club crece con el apoyo de su gente.
                </p>
              </div>

              {hasSocios ? (
                <Link
                  href={`/${club.slug}/socios`}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--tenant-accent)] px-6 text-sm font-bold text-[var(--public-text)] transition hover:opacity-90"
                >
                  Involúcrate
                </Link>
              ) : null}
            </div>
          </PublicCard>
        </div>
      </section>

      <footer className="border-t border-[var(--public-border)] px-3 py-10 text-center text-sm text-[var(--public-text-muted)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="font-bold text-[var(--public-text)]">{settings.public_name}</p>

          <p className="mt-3">
            © {new Date().getFullYear()} {settings.public_name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-[var(--public-text)]">{title}</h2>

      <p className="mt-1 text-sm text-[var(--public-text-muted)]">{description}</p>
    </div>
  );
}
