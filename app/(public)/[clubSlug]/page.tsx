import type { CSSProperties } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Shield, Trophy, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { PublicClubNav } from "@/components/public/PublicClubNav";
import { PublicCard } from "@/components/public/PublicCard";
import { CLUB_EVENT_STATUS_LABELS, type ClubEventStatus } from "@/server/schemas/calendar-event";
import {
  getPublicCalendarEvents,
  type PublicCalendarEvent,
  type PublicMatchDetails,
} from "@/server/queries/get-public-calendar-events";
import { getPublicClubPage } from "@/server/queries/get-public-club-page";

type PublicClubHomePageProps = {
  params: Promise<{
    clubSlug: string;
  }>;
};

export default async function PublicClubHomePage({ params }: PublicClubHomePageProps) {
  const { clubSlug } = await params;

  const pageResult = await getPublicClubPage(clubSlug);

  if (!pageResult.ok || !pageResult.data) {
    notFound();
  }

  const { club, settings, enabledModules } = pageResult.data;

  const eventsResult = await getPublicCalendarEvents(club.slug);
  const events = eventsResult.ok && eventsResult.data ? eventsResult.data.events : [];

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

      <section className="px-3 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[var(--public-text)] sm:rounded-[2rem]">
            {settings.cover_image_url ? (
              <img
                src={settings.cover_image_url}
                alt={`Portada de ${settings.public_name}`}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

            <div className="relative flex min-h-[420px] flex-col justify-end px-4 py-7 text-white sm:min-h-[460px] sm:px-10 sm:py-12 lg:min-h-[560px]">
              <div className="max-w-2xl">
                <div className="mb-5 flex min-w-0 items-center gap-3">
                  <ClubMark name={settings.public_name} logoUrl={settings.logo_url} />

                  <p className="min-w-0 truncate text-sm font-semibold uppercase tracking-[0.18em] text-white/75 sm:tracking-[0.22em]">
                    {settings.public_name}
                  </p>
                </div>

                <h1 className="max-w-full text-[2.35rem] font-black leading-[0.95] tracking-tight sm:text-6xl">
                  Más que un club, una familia
                </h1>

                <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/85 sm:text-lg sm:leading-7">
                  Bienvenidos a la casa oficial de nuestra comunidad deportiva. Revisa partidos, resultados, actividades
                  y novedades del club.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {hasSocios ? (
                    <Link
                      href={`/${club.slug}/socios`}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--tenant-accent)] px-5 py-3 text-sm font-bold text-[var(--public-text)] transition hover:opacity-90 sm:w-auto"
                    >
                      Hazte socio
                    </Link>
                  ) : null}

                  {hasCalendario ? (
                    <Link
                      href={`/${club.slug}/calendario`}
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white/15 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20 sm:w-auto"
                    >
                      Ver calendario
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

function RecentMatchCard({
  event,
  clubName,
  clubLogoUrl,
}: {
  event: PublicCalendarEvent;
  clubName: string;
  clubLogoUrl: string | null;
}) {
  if (!event.match_details) return null;

  const teams = getMatchTeams({
    clubName,
    clubLogoUrl,
    details: event.match_details,
  });

  const resultLabel = getResultLabel({
    clubScore: event.match_details.club_score,
    opponentScore: event.match_details.opponent_score,
  });

  return (
    <PublicCard>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <ResultPill label={resultLabel} />

        <div className="min-w-0">
          <p className="truncate text-base font-black text-[var(--public-text)]">
            vs {event.match_details.opponent_name}
          </p>

          <p className="mt-1 truncate text-sm text-[var(--public-text-muted)]">{formatShortDate(event.starts_at)}</p>
        </div>

        <p className="whitespace-nowrap text-xl font-black text-[var(--public-text)] sm:text-2xl">
          {teams.home.score ?? "-"} - {teams.away.score ?? "-"}
        </p>
      </div>
    </PublicCard>
  );
}

function NextMatchCard({
  event,
  clubName,
  clubLogoUrl,
}: {
  event: PublicCalendarEvent;
  clubName: string;
  clubLogoUrl: string | null;
}) {
  if (!event.match_details) return null;

  const teams = getMatchTeams({
    clubName,
    clubLogoUrl,
    details: event.match_details,
  });

  return (
    <PublicCard>
      <div className="space-y-5">
        <div className="rounded-2xl bg-[var(--public-surface-muted)] p-4">
          <p className="text-center text-sm font-bold leading-5 text-[var(--public-text-muted)]">
            {formatDate(event.starts_at)}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
          <HomeTeamBlock team={teams.home} />

          <div className="flex justify-center">
            <p className="rounded-full bg-[var(--public-surface-muted)] px-4 py-2 text-lg font-black text-[var(--public-text-soft)]">
              VS
            </p>
          </div>

          <HomeTeamBlock team={teams.away} alignRight />
        </div>

        <div className="space-y-3 border-t border-[var(--public-border)] pt-4">
          {event.location ? (
            <p className="text-center text-sm leading-6 text-[var(--public-text-muted)]">
              <span className="font-bold text-[var(--public-text)]">Lugar:</span> {event.location}
            </p>
          ) : null}

          {event.location_url ? (
            <div className="flex justify-center">
              <a
                href={event.location_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--tenant-accent)] px-5 text-sm font-bold text-[var(--public-text)] transition hover:opacity-90 sm:w-auto"
              >
                <MapPin size={16} />
                Cómo llegar
              </a>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-[var(--public-success-bg)] px-3 py-1 text-xs font-bold text-[var(--public-success-text)]">
            {event.match_details.club_side === "home"
              ? "En casa"
              : event.match_details.club_side === "away"
                ? "Visita"
                : "Neutral"}
          </span>

          <span className="rounded-full bg-[var(--public-neutral-bg)] px-3 py-1 text-xs font-bold text-[var(--public-neutral-text)]">
            {CLUB_EVENT_STATUS_LABELS[event.status]}
          </span>
        </div>
      </div>
    </PublicCard>
  );
}

function QuickLinks({
  clubSlug,
  showCalendario,
  showSocios,
  showTransparencia,
  showTienda,
}: {
  clubSlug: string;
  showCalendario: boolean;
  showSocios: boolean;
  showTransparencia: boolean;
  showTienda: boolean;
}) {
  const links = [
    showCalendario
      ? {
          href: `/${clubSlug}/calendario`,
          label: "Calendario",
          icon: CalendarDays,
        }
      : null,
    showSocios
      ? {
          href: `/${clubSlug}/socios`,
          label: "Socios",
          icon: Users,
        }
      : null,
    showTransparencia
      ? {
          href: `/${clubSlug}/transparencia`,
          label: "Transparencia",
          icon: Shield,
        }
      : null,
    showTienda
      ? {
          href: `/${clubSlug}/tienda`,
          label: "Tienda",
          icon: Trophy,
        }
      : null,
  ].filter(Boolean);

  if (links.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => {
        if (!link) return null;

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

type HomeTeam = {
  name: string;
  score: number | null;
  kitColor: string | null;
  logoUrl: string | null;
  isTenantClub: boolean;
};

function HomeTeamBlock({ team, alignRight = false }: { team: HomeTeam; alignRight?: boolean }) {
  return (
    <div className={alignRight ? "min-w-0 text-left sm:text-right" : "min-w-0 text-left"}>
      <div className={alignRight ? "mb-2 flex justify-start sm:justify-end" : "mb-2 flex justify-start"}>
        <ClubMark name={team.name} logoUrl={team.logoUrl} />
      </div>

      <p className="break-words text-sm font-black leading-5 text-[var(--public-text)]">{team.name}</p>

      <div className={alignRight ? "mt-2 flex items-center gap-2 sm:justify-end" : "mt-2 flex items-center gap-2"}>
        <KitColorDot color={team.kitColor} />
        <span className="text-xs text-[var(--public-text-muted)]">Camiseta</span>
      </div>
    </div>
  );
}

function ClubMark({ name, logoUrl }: { name: string; logoUrl: string | null }) {
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

function KitColorDot({ color }: { color: string | null }) {
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

function ResultPill({ label }: { label: "V" | "E" | "D" | "-" }) {
  const classNameByLabel: Record<typeof label, string> = {
    V: "bg-[var(--public-success-bg)] text-[var(--public-success-text)]",
    E: "bg-[var(--public-neutral-bg)] text-[var(--public-neutral-text)]",
    D: "bg-[var(--public-danger-bg)] text-[var(--public-danger-text)]",
    "-": "bg-[var(--public-neutral-bg)] text-[var(--public-text-muted)]",
  };

  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${classNameByLabel[label]}`}
    >
      {label}
    </span>
  );
}

function getMatchTeams({
  clubName,
  clubLogoUrl,
  details,
}: {
  clubName: string;
  clubLogoUrl: string | null;
  details: PublicMatchDetails;
}) {
  const tenantClub = {
    name: clubName,
    score: details.club_score,
    kitColor: details.club_kit_color,
    logoUrl: clubLogoUrl,
    isTenantClub: true,
  };

  const opponent = {
    name: details.opponent_name,
    score: details.opponent_score,
    kitColor: details.opponent_kit_color,
    logoUrl: null,
    isTenantClub: false,
  };

  if (details.club_side === "away") {
    return {
      home: opponent,
      away: tenantClub,
    };
  }

  return {
    home: tenantClub,
    away: opponent,
  };
}

function getResultLabel({
  clubScore,
  opponentScore,
}: {
  clubScore: number | null;
  opponentScore: number | null;
}): "V" | "E" | "D" | "-" {
  if (clubScore === null || opponentScore === null) return "-";

  if (clubScore > opponentScore) return "V";
  if (clubScore < opponentScore) return "D";

  return "E";
}

function getInitials(value: string) {
  return value
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
  }).format(new Date(value));
}
