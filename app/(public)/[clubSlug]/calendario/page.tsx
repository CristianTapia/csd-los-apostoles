import type { CSSProperties } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { PublicClubNav } from "@/components/public/PublicClubNav";
import { Card } from "@/components/ui/Card";
import {
  CLUB_EVENT_STATUS_LABELS,
  CLUB_EVENT_TYPE_LABELS,
  CLUB_MATCH_SIDE_LABELS,
} from "@/server/schemas/calendar-event";
import {
  getPublicCalendarEvents,
  type PublicCalendarEvent,
  type PublicMatchDetails,
} from "@/server/queries/get-public-calendar-events";
import { getPublicClubPage } from "@/server/queries/get-public-club-page";

type PublicCalendarPageProps = {
  params: Promise<{
    clubSlug: string;
  }>;
};

export default async function PublicCalendarPage({ params }: PublicCalendarPageProps) {
  const { clubSlug } = await params;

  const pageResult = await getPublicClubPage(clubSlug);

  if (!pageResult.ok || !pageResult.data) {
    notFound();
  }

  const { club, settings, enabledModules } = pageResult.data;

  const calendarModule = enabledModules.find((item) => item.module === "calendario");

  if (!calendarModule) {
    notFound();
  }

  const eventsResult = await getPublicCalendarEvents(club.slug);
  const events = eventsResult.ok && eventsResult.data ? eventsResult.data.events : [];

  const now = new Date();

  const upcomingEvents = events.filter((event) => {
    if (event.status === "completed" || event.status === "cancelled") {
      return false;
    }

    return new Date(event.starts_at) >= now;
  });

  const pastEvents = events
    .filter((event) => {
      return event.status === "completed" || event.status === "cancelled" || new Date(event.starts_at) < now;
    })
    .reverse();

  const themeStyle = {
    "--tenant-primary": settings.primary_color,
    "--tenant-secondary": settings.secondary_color,
    "--tenant-accent": settings.accent_color,
  } as CSSProperties;

  return (
    <main style={themeStyle} className="min-h-dvh bg-white text-gray-950">
      <PublicClubNav clubSlug={club.slug} modules={enabledModules} />

      <section className="bg-[var(--tenant-primary)] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/70">{settings.public_name}</p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Calendario</h1>

          <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            Revisa los próximos partidos, actividades y eventos públicos del club.
          </p>

          <div className="mt-7">
            <Link
              href={`/${club.slug}`}
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--tenant-primary)] transition hover:bg-white/90"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          {!eventsResult.ok ? (
            <Card className="border-red-200 bg-red-50 text-sm text-red-700">
              {eventsResult.message ?? "No se pudo cargar el calendario."}
            </Card>
          ) : null}

          {events.length === 0 && eventsResult.ok ? (
            <Card>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-950">Todavía no hay eventos públicos</h2>

                <p className="text-sm text-gray-600">
                  Cuando el club publique partidos o actividades, aparecerán en esta sección.
                </p>
              </div>
            </Card>
          ) : null}

          {upcomingEvents.length > 0 ? (
            <section className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--tenant-primary)]">
                  Próximamente
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-950">Próximos eventos</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {upcomingEvents.map((event) => (
                  <PublicEventCard key={event.id} event={event} clubName={club.name} clubLogoUrl={settings.logo_url} />
                ))}
              </div>
            </section>
          ) : null}

          {pastEvents.length > 0 ? (
            <section className="space-y-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Historial</p>

                <h2 className="mt-2 text-2xl font-bold text-gray-950">Eventos anteriores</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {pastEvents.map((event) => (
                  <PublicEventCard key={event.id} event={event} clubName={club.name} clubLogoUrl={settings.logo_url} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function PublicEventCard({
  event,
  clubName,
  clubLogoUrl,
}: {
  event: PublicCalendarEvent;
  clubName: string;
  clubLogoUrl: string | null;
}) {
  if (event.event_type === "match" && event.match_details) {
    return (
      <PublicMatchCard event={event} details={event.match_details} clubName={clubName} clubLogoUrl={clubLogoUrl} />
    );
  }

  return <GenericPublicEventCard event={event} />;
}

function PublicMatchCard({
  event,
  details,
  clubName,
  clubLogoUrl,
}: {
  event: PublicCalendarEvent;
  details: PublicMatchDetails;
  clubName: string;
  clubLogoUrl: string | null;
}) {
  const teams = getMatchTeams({
    clubName,
    clubLogoUrl,
    details,
  });

  return (
    <Card>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--tenant-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--tenant-primary)]">
            Partido
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {CLUB_EVENT_STATUS_LABELS[event.status]}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {CLUB_MATCH_SIDE_LABELS[details.club_side]}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <PublicTeamBlock team={teams.home} />

          <div className="flex items-center justify-center rounded-2xl bg-gray-50 px-5 py-4">
            {teams.home.score !== null && teams.away.score !== null ? (
              <p className="text-3xl font-bold text-gray-950">
                {teams.home.score} - {teams.away.score}
              </p>
            ) : (
              <p className="text-sm font-semibold text-gray-500">VS</p>
            )}
          </div>

          <PublicTeamBlock team={teams.away} alignRight />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-950">
            {teams.home.name} vs {teams.away.name}
          </h3>

          <p className="mt-1 text-sm text-gray-600">{formatDate(event.starts_at)}</p>
        </div>

        <div className="space-y-2">
          {event.location ? <p className="text-sm text-gray-600">Lugar: {event.location}</p> : null}

          {event.location_url ? (
            <a
              href={event.location_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--tenant-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <MapPin size={16} />
              Cómo llegar
            </a>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {details.competition_name ? (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {details.competition_name}
            </span>
          ) : null}

          {details.category ? (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {details.category}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function GenericPublicEventCard({ event }: { event: PublicCalendarEvent }) {
  return (
    <Card>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--tenant-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--tenant-primary)]">
            {CLUB_EVENT_TYPE_LABELS[event.event_type]}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {CLUB_EVENT_STATUS_LABELS[event.status]}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-950">{event.title}</h3>

          <p className="mt-1 text-sm text-gray-600">{formatDate(event.starts_at)}</p>
        </div>

        {event.location ? <p className="text-sm text-gray-600">Lugar: {event.location}</p> : null}

        {event.location_url ? (
          <a
            href={event.location_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--tenant-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <MapPin size={16} />
            Cómo llegar
          </a>
        ) : null}

        {event.description ? <p className="text-sm leading-6 text-gray-600">{event.description}</p> : null}
      </div>
    </Card>
  );
}

type PublicTeam = {
  name: string;
  score: number | null;
  kitColor: string | null;
  logoUrl: string | null;
  isTenantClub: boolean;
};

function PublicTeamBlock({ team, alignRight = false }: { team: PublicTeam; alignRight?: boolean }) {
  return (
    <div className={alignRight ? "flex items-center gap-3 sm:justify-end" : "flex items-center gap-3"}>
      {!alignRight ? <TeamMark team={team} /> : null}

      <div className={alignRight ? "text-left sm:text-right" : undefined}>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {team.isTenantClub ? "Club" : "Rival"}
        </p>

        <p className="mt-1 text-base font-semibold text-gray-950">{team.name}</p>

        <div className={alignRight ? "mt-2 flex items-center gap-2 sm:justify-end" : "mt-2 flex items-center gap-2"}>
          <KitColorDot color={team.kitColor} />
          <span className="text-xs text-gray-500">Camiseta</span>
        </div>
      </div>

      {alignRight ? <TeamMark team={team} /> : null}
    </div>
  );
}

function TeamMark({ team }: { team: PublicTeam }) {
  if (team.logoUrl) {
    return (
      <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white">
        <img src={team.logoUrl} alt={`Logo de ${team.name}`} className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-sm font-bold text-gray-500">
      {getInitials(team.name)}
    </span>
  );
}

function KitColorDot({ color }: { color: string | null }) {
  if (!color) {
    return <span className="h-4 w-4 rounded-full border border-dashed border-gray-400 bg-white" />;
  }

  return (
    <span
      className="h-4 w-4 rounded-full border border-black/15 shadow-sm"
      style={{ backgroundColor: color } as CSSProperties}
    />
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
