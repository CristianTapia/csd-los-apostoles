import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { CLUB_EVENT_STATUS_LABELS } from "@/server/schemas/calendar-event";
import { NON_MATCH_CLUB_EVENT_TYPE_LABELS, type DashboardClubEvent } from "@/server/schemas/club-event";
import { getDashboardClubEvents } from "@/server/queries/get-dashboard-club-events";
import { ClubEventForm } from "./ClubEventForm";
import { EventStatusForm } from "./EventStatusForm";

export default async function DashboardEventosPage() {
  const result = await getDashboardClubEvents();

  if (!result.ok || !result.data) {
    return (
      <section className="space-y-5">
        <PageHeader title="Eventos" description="Administra actividades, reuniones y eventos del club." />

        <Card className="border-red-200 bg-red-50 text-sm text-red-700">
          {result.message ?? "No se pudieron cargar los eventos."}
        </Card>
      </section>
    );
  }

  const { club, events } = result.data;

  const upcomingEvents = events.filter((event) => {
    if (event.status === "completed" || event.status === "cancelled") {
      return false;
    }

    return new Date(event.starts_at) >= new Date();
  });

  const pastEvents = events
    .filter((event) => {
      return event.status === "completed" || event.status === "cancelled" || new Date(event.starts_at) < new Date();
    })
    .reverse();

  return (
    <section className="space-y-5">
      <PageHeader title="Eventos" description={`Administra actividades públicas y privadas de ${club.name}.`} />

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-font-main">Crear evento</h2>

          <p className="mt-1 text-sm text-font-secondary">
            Agrega actividades, reuniones, campañas o eventos comunitarios del club.
          </p>
        </div>

        <ClubEventForm />
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-font-main">Próximos eventos</h2>

          <p className="mt-1 text-sm text-font-secondary">Eventos programados que todavía no han finalizado.</p>
        </div>

        {upcomingEvents.length === 0 ? (
          <Card>
            <p className="text-sm text-font-secondary">Todavía no hay próximos eventos.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <DashboardEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {pastEvents.length > 0 ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-font-main">Eventos anteriores</h2>

            <p className="mt-1 text-sm text-font-secondary">
              Historial de eventos finalizados, cancelados o ya pasados.
            </p>
          </div>

          <div className="space-y-3">
            {pastEvents.map((event) => (
              <DashboardEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function DashboardEventCard({ event }: { event: DashboardClubEvent }) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-font-secondary dark:bg-white/10">
                {NON_MATCH_CLUB_EVENT_TYPE_LABELS[event.event_type]}
              </span>

              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-font-secondary dark:bg-white/10">
                {CLUB_EVENT_STATUS_LABELS[event.status]}
              </span>

              <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-font-secondary dark:bg-white/10">
                {event.is_public ? "Público" : "Privado"}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-semibold text-font-main">{event.title}</h3>

            <p className="mt-1 text-sm text-font-secondary">
              {formatDate(event.starts_at)}
              {event.ends_at ? ` — ${formatDate(event.ends_at)}` : ""}
            </p>

            {event.location ? <p className="mt-2 text-sm text-font-secondary">Lugar: {event.location}</p> : null}

            {event.description ? (
              <p className="mt-3 text-sm leading-6 text-font-secondary">{event.description}</p>
            ) : null}

            {event.location_url ? (
              <a
                href={event.location_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-font-main underline underline-offset-4"
              >
                <MapPin size={16} />
                Abrir ubicación
              </a>
            ) : null}
          </div>

          <EventStatusForm eventId={event.id} status={event.status} />
        </div>
      </div>
    </Card>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
