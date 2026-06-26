import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicClubNav } from "@/components/public/PublicClubNav";
import { Card } from "@/components/ui/Card";
import { CLUB_EVENT_STATUS_LABELS, CLUB_EVENT_TYPE_LABELS } from "@/server/schemas/calendar-event";
import { getPublicCalendarEvents } from "@/server/queries/get-public-calendar-events";
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
                  <PublicEventCard key={event.id} event={event} />
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
                  <PublicEventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}

type PublicEventCardProps = {
  event: {
    title: string;
    description: string | null;
    event_type: keyof typeof CLUB_EVENT_TYPE_LABELS;
    status: keyof typeof CLUB_EVENT_STATUS_LABELS;
    starts_at: string;
    ends_at: string | null;
    location: string | null;
    opponent: string | null;
    home_score: number | null;
    away_score: number | null;
  };
};

function PublicEventCard({ event }: PublicEventCardProps) {
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

        {event.opponent ? <p className="text-sm text-gray-600">Rival: {event.opponent}</p> : null}

        {event.home_score !== null && event.away_score !== null ? (
          <p className="text-sm font-semibold text-gray-950">
            Resultado: {event.home_score} - {event.away_score}
          </p>
        ) : null}

        {event.description ? <p className="text-sm leading-6 text-gray-600">{event.description}</p> : null}
      </div>
    </Card>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}
