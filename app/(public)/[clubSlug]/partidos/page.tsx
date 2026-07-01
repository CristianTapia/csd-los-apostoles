import type { CSSProperties } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { PublicClubNav } from "@/components/public/PublicClubNav";
import { PublicCard } from "@/components/public/PublicCard";
import { PublicKitColorDot, PublicTeamMark } from "@/components/public/matches/PublicTeamMark";
import { formatDate, formatShortDate, getMatchTeams, getResultLabel } from "@/components/public/matches/match-utils";
import {
  getPublicCalendarEvents,
  type PublicCalendarEvent,
  type PublicMatchDetails,
} from "@/server/queries/get-public-calendar-events";
import { getPublicClubPage } from "@/server/queries/get-public-club-page";

type PublicMatchesPageProps = {
  params: Promise<{
    clubSlug: string;
  }>;
};

type PublicMatchEvent = PublicCalendarEvent & {
  match_details: PublicMatchDetails;
};

type MatchStats = {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  winRate: number;
};

export default async function PublicMatchesPage({ params }: PublicMatchesPageProps) {
  const { clubSlug } = await params;

  const pageResult = await getPublicClubPage(clubSlug);

  if (!pageResult.ok || !pageResult.data) {
    notFound();
  }

  const { club, settings, enabledModules } = pageResult.data;

  const matchesModule = enabledModules.find((item) => item.module === "partidos");

  if (!matchesModule) {
    notFound();
  }

  const eventsResult = await getPublicCalendarEvents(club.slug);
  const events = eventsResult.ok && eventsResult.data ? eventsResult.data.events : [];

  const matches = events.filter(isPublicMatchEvent);
  const now = new Date();

  const upcomingMatches = matches.filter((match) => {
    if (match.status === "completed" || match.status === "cancelled") {
      return false;
    }

    return new Date(match.starts_at) >= now;
  });

  const nextMatch = upcomingMatches[0] ?? null;

  const historicalMatches = matches
    .filter((match) => {
      return match.status === "completed" || match.status === "cancelled" || new Date(match.starts_at) < now;
    })
    .reverse();

  const completedMatches = matches.filter((match) => hasCompletedScore(match)).reverse();

  const stats = calculateStats(completedMatches);

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

  return (
    <main style={themeStyle} className="min-h-dvh overflow-x-hidden bg-[var(--public-bg)] text-[var(--public-text)]">
      <PublicClubNav clubSlug={club.slug} modules={enabledModules} />

      <section className="px-3 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="rounded-[2rem] bg-[var(--public-text)] px-5 py-8 text-white sm:px-8 sm:py-10">
            <div className="flex items-center gap-3">
              <PublicTeamMark name={settings.public_name} logoUrl={settings.logo_url} />

              <p className="min-w-0 truncate text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                {settings.public_name}
              </p>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-none tracking-tight sm:text-5xl">Partidos</h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              Revisa el próximo encuentro, resultados recientes, historial y rendimiento deportivo del club.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/${club.slug}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-white/15 px-5 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/20"
              >
                Inicio
              </Link>

              <Link
                href={`/${club.slug}/calendario`}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--tenant-accent)] px-5 text-sm font-bold text-[var(--public-text)] transition hover:opacity-90"
              >
                Ver calendario
              </Link>
            </div>
          </header>

          {!eventsResult.ok ? (
            <PublicCard className="border-red-200 bg-red-50 text-sm text-red-700">
              {eventsResult.message ?? "No se pudieron cargar los partidos."}
            </PublicCard>
          ) : null}

          {matches.length === 0 && eventsResult.ok ? (
            <PublicCard>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-[var(--public-text)]">Todavía no hay partidos publicados</h2>

                <p className="text-sm text-[var(--public-text-muted)]">
                  Cuando el club publique partidos, aparecerán en esta sección.
                </p>
              </div>
            </PublicCard>
          ) : null}

          {matches.length > 0 ? (
            <>
              <StatsGrid stats={stats} />

              <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <SectionHeader title="Próximo partido" description="El siguiente encuentro programado." />

                  {nextMatch ? (
                    <FeaturedMatchCard match={nextMatch} clubName={club.name} clubLogoUrl={settings.logo_url} />
                  ) : (
                    <PublicCard>
                      <p className="text-sm text-[var(--public-text-muted)]">No hay próximos partidos programados.</p>
                    </PublicCard>
                  )}
                </div>

                <div className="space-y-4">
                  <SectionHeader title="Últimos resultados" description="Resultados recientes del club." />

                  {completedMatches.length === 0 ? (
                    <PublicCard>
                      <p className="text-sm text-[var(--public-text-muted)]">Todavía no hay resultados finalizados.</p>
                    </PublicCard>
                  ) : (
                    <div className="space-y-3">
                      {completedMatches.slice(0, 5).map((match) => (
                        <CompactResultCard
                          key={match.id}
                          match={match}
                          clubName={club.name}
                          clubLogoUrl={settings.logo_url}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Historial" description="Todos los partidos publicados por el club." />

                {historicalMatches.length === 0 ? (
                  <PublicCard>
                    <p className="text-sm text-[var(--public-text-muted)]">Todavía no hay historial de partidos.</p>
                  </PublicCard>
                ) : (
                  <div className="space-y-3">
                    {historicalMatches.map((match) => (
                      <HistoryMatchCard
                        key={match.id}
                        match={match}
                        clubName={club.name}
                        clubLogoUrl={settings.logo_url}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function StatsGrid({ stats }: { stats: MatchStats }) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      <StatCard label="PJ" value={stats.played} />
      <StatCard label="G" value={stats.wins} />
      <StatCard label="E" value={stats.draws} />
      <StatCard label="P" value={stats.losses} />
      <StatCard label="GF" value={stats.goalsFor} />
      <StatCard label="GC" value={stats.goalsAgainst} />
      <StatCard label="DG" value={formatSignedNumber(stats.goalDifference)} />
      <StatCard label="%G" value={`${stats.winRate}%`} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <PublicCard className="p-3 text-center sm:p-4">
      <p className="text-2xl font-black text-[var(--public-text)]">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[var(--public-text-muted)]">{label}</p>
    </PublicCard>
  );
}

function FeaturedMatchCard({
  match,
  clubName,
  clubLogoUrl,
}: {
  match: PublicMatchEvent;
  clubName: string;
  clubLogoUrl: string | null;
}) {
  const teams = getMatchTeams({
    clubName,
    clubLogoUrl,
    details: match.match_details,
  });

  return (
    <PublicCard>
      <div className="space-y-5">
        <div className="rounded-2xl bg-[var(--public-surface-muted)] p-4 text-center">
          <p className="text-sm font-bold leading-5 text-[var(--public-text-muted)]">{formatDate(match.starts_at)}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
          <TeamBlock name={teams.home.name} logoUrl={teams.home.logoUrl} kitColor={teams.home.kitColor} />

          <div className="flex justify-center">
            <span className="rounded-full bg-[var(--public-surface-muted)] px-4 py-2 text-lg font-black text-[var(--public-text-soft)]">
              VS
            </span>
          </div>

          <TeamBlock name={teams.away.name} logoUrl={teams.away.logoUrl} kitColor={teams.away.kitColor} alignRight />
        </div>

        {match.location ? (
          <p className="text-center text-sm leading-6 text-[var(--public-text-muted)]">
            <span className="font-bold text-[var(--public-text)]">Lugar:</span> {match.location}
          </p>
        ) : null}

        {match.location_url ? (
          <div className="flex justify-center">
            <a
              href={match.location_url}
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
    </PublicCard>
  );
}

function CompactResultCard({
  match,
  clubName,
  clubLogoUrl,
}: {
  match: PublicMatchEvent;
  clubName: string;
  clubLogoUrl: string | null;
}) {
  const teams = getMatchTeams({
    clubName,
    clubLogoUrl,
    details: match.match_details,
  });

  const result = getResultLabel({
    clubScore: match.match_details.club_score,
    opponentScore: match.match_details.opponent_score,
  });

  return (
    <PublicCard>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <ResultPill result={result} />

        <div className="min-w-0">
          <p className="truncate text-base font-black text-[var(--public-text)]">
            {teams.home.name} vs {teams.away.name}
          </p>

          <p className="mt-1 truncate text-sm text-[var(--public-text-muted)]">{formatShortDate(match.starts_at)}</p>
        </div>

        <p className="whitespace-nowrap text-xl font-black text-[var(--public-text)]">
          {teams.home.score ?? "-"} - {teams.away.score ?? "-"}
        </p>
      </div>
    </PublicCard>
  );
}

function HistoryMatchCard({
  match,
  clubName,
  clubLogoUrl,
}: {
  match: PublicMatchEvent;
  clubName: string;
  clubLogoUrl: string | null;
}) {
  const teams = getMatchTeams({
    clubName,
    clubLogoUrl,
    details: match.match_details,
  });

  const hasScore = hasCompletedScore(match);

  return (
    <PublicCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--public-text-muted)]">
            {formatShortDate(match.starts_at)}
          </p>

          <h3 className="mt-1 break-words text-base font-black text-[var(--public-text)]">
            {teams.home.name} vs {teams.away.name}
          </h3>

          {match.location ? <p className="mt-1 text-sm text-[var(--public-text-muted)]">{match.location}</p> : null}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {hasScore ? (
            <>
              <ResultPill
                result={getResultLabel({
                  clubScore: match.match_details.club_score,
                  opponentScore: match.match_details.opponent_score,
                })}
              />

              <p className="text-2xl font-black text-[var(--public-text)]">
                {teams.home.score} - {teams.away.score}
              </p>
            </>
          ) : (
            <span className="rounded-full bg-[var(--public-neutral-bg)] px-3 py-1 text-xs font-bold text-[var(--public-neutral-text)]">
              {match.status === "cancelled" ? "Cancelado" : "Programado"}
            </span>
          )}
        </div>
      </div>
    </PublicCard>
  );
}

function TeamBlock({
  name,
  logoUrl,
  kitColor,
  alignRight = false,
}: {
  name: string;
  logoUrl: string | null;
  kitColor: string | null;
  alignRight?: boolean;
}) {
  return (
    <div className={alignRight ? "min-w-0 sm:text-right" : "min-w-0"}>
      <div className={alignRight ? "mb-2 flex justify-start sm:justify-end" : "mb-2 flex justify-start"}>
        <PublicTeamMark name={name} logoUrl={logoUrl} />
      </div>

      <p className="break-words text-sm font-black leading-5 text-[var(--public-text)]">{name}</p>

      <div className={alignRight ? "mt-2 flex items-center gap-2 sm:justify-end" : "mt-2 flex items-center gap-2"}>
        <PublicKitColorDot color={kitColor} />
        <span className="text-xs text-[var(--public-text-muted)]">Camiseta</span>
      </div>
    </div>
  );
}

function ResultPill({ result }: { result: "V" | "E" | "D" | "-" }) {
  const classNameByResult: Record<typeof result, string> = {
    V: "bg-[var(--public-success-bg)] text-[var(--public-success-text)]",
    E: "bg-[var(--public-neutral-bg)] text-[var(--public-neutral-text)]",
    D: "bg-[var(--public-danger-bg)] text-[var(--public-danger-text)]",
    "-": "bg-[var(--public-neutral-bg)] text-[var(--public-text-muted)]",
  };

  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${classNameByResult[result]}`}
    >
      {result}
    </span>
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

function isPublicMatchEvent(event: PublicCalendarEvent): event is PublicMatchEvent {
  return event.event_type === "match" && event.match_details !== null;
}

function hasCompletedScore(match: PublicMatchEvent) {
  return (
    match.status === "completed" &&
    match.match_details.club_score !== null &&
    match.match_details.opponent_score !== null
  );
}

function calculateStats(matches: PublicMatchEvent[]): MatchStats {
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (const match of matches) {
    const clubScore = match.match_details.club_score;
    const opponentScore = match.match_details.opponent_score;

    if (clubScore === null || opponentScore === null) continue;

    goalsFor += clubScore;
    goalsAgainst += opponentScore;

    if (clubScore > opponentScore) {
      wins += 1;
    } else if (clubScore < opponentScore) {
      losses += 1;
    } else {
      draws += 1;
    }
  }

  const played = wins + draws + losses;
  const goalDifference = goalsFor - goalsAgainst;
  const winRate = played > 0 ? Math.round((wins / played) * 100) : 0;

  return {
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference,
    winRate,
  };
}

function formatSignedNumber(value: number) {
  if (value > 0) return `+${value}`;

  return String(value);
}
