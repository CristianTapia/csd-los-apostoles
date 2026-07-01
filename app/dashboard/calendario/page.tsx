import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { CLUB_EVENT_STATUS_LABELS, CLUB_EVENT_TYPE_LABELS } from "@/server/schemas/calendar-event";
import { getDashboardCalendarEvents } from "@/server/queries/get-dashboard-calendar-events";
import { requireDashboardModule } from "@/server/queries/get-active-dashboard-context";

export default async function DashboardCalendarioPage() {
  const moduleAccess = await requireDashboardModule("calendario");

  if (!moduleAccess.ok) {
    notFound();
  }

  const result = await getDashboardCalendarEvents();

  if (!result.ok || !result.data) {
    return (
      <section className="space-y-5">
        <PageHeader title="Calendario" description="Administra partidos, actividades y eventos del club." />

        <Card className="border-red-200 bg-red-50 text-sm text-red-700">
          {result.message ?? "No se pudo cargar el calendario."}
        </Card>
      </section>
    );
  }

  const { club, events } = result.data;

  return (
    <section className="space-y-5">
      <PageHeader title="Calendario" description={`Administra los eventos públicos y privados de ${club.name}.`} />

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-font-main">Crear evento</h2>

          <p className="mt-1 text-sm text-font-secondary">
            Agrega partidos, entrenamientos, rifas, reuniones o actividades del club.
          </p>
        </div>
      </Card>

      {events.length === 0 ? (
        <Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-font-main">Todavía no hay eventos</h2>

            <p className="text-sm text-font-secondary">Cuando crees eventos, aparecerán en esta lista.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-font-secondary">
                    {CLUB_EVENT_TYPE_LABELS[event.event_type]} · {CLUB_EVENT_STATUS_LABELS[event.status]}
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-font-main">{event.title}</h2>

                  <p className="mt-1 text-sm text-font-secondary">{formatDate(event.starts_at)}</p>

                  {event.location ? <p className="mt-1 text-sm text-font-secondary">Lugar: {event.location}</p> : null}

                  {event.opponent ? <p className="mt-1 text-sm text-font-secondary">Rival: {event.opponent}</p> : null}

                  {event.home_score !== null && event.away_score !== null ? (
                    <p className="mt-1 text-sm font-medium text-font-main">
                      Resultado: {event.home_score} - {event.away_score}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-font-secondary dark:bg-white/10">
                  {event.is_public ? "Público" : "Privado"}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}
