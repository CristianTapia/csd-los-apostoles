import { MatchEventForm } from "./MatchEventForm";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { CLUB_EVENT_STATUS_LABELS, CLUB_MATCH_SIDE_LABELS } from "@/server/schemas/calendar-event";
import { getDashboardMatchEvents, type DashboardMatchEvent } from "@/server/queries/get-dashboard-match-events";

export default async function DashboardPartidosPage() {
  const result = await getDashboardMatchEvents();

  if (!result.ok || !result.data) {
    return (
      <section className="space-y-5">
        <PageHeader title="Partidos" description="Administra los partidos del club." />

        <Card className="border-red-200 bg-red-50 text-sm text-red-700">
          {result.message ?? "No se pudieron cargar los partidos."}
        </Card>
      </section>
    );
  }

  const { club, matches } = result.data;

  return (
    <section className="space-y-5">
      <PageHeader title="Partidos" description={`Administra los partidos de ${club.name}.`} />

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-font-main">Crear partido</h2>

          <p className="mt-1 text-sm text-font-secondary">
            Agrega partidos programados. Luego podrás actualizar marcador, estado y colores de camiseta.
          </p>
        </div>

        <MatchEventForm clubName={club.name} />
      </Card>

      {matches.length === 0 ? (
        <Card>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-font-main">Todavía no hay partidos</h2>

            <p className="text-sm text-font-secondary">Cuando crees partidos, aparecerán en esta lista.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <MatchCard key={match.id} clubName={club.name} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}

function MatchCard({ clubName, match }: { clubName: string; match: DashboardMatchEvent }) {
  const teams = getTeams({ clubName, match });

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-font-secondary">
              Partido · {CLUB_EVENT_STATUS_LABELS[match.status]} · {CLUB_MATCH_SIDE_LABELS[match.club_side]}
            </p>

            <h2 className="mt-1 text-lg font-semibold text-font-main">
              {teams.home} vs {teams.away}
            </h2>

            <p className="mt-1 text-sm text-font-secondary">{formatDate(match.starts_at)}</p>

            {match.location ? <p className="mt-1 text-sm text-font-secondary">Lugar: {match.location}</p> : null}

            {match.location_url ? (
              <a
                href={match.location_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm font-medium text-font-main underline underline-offset-4"
              >
                Abrir ubicación
              </a>
            ) : null}

            {match.competition_name ? (
              <p className="mt-2 text-sm text-font-secondary">Competencia: {match.competition_name}</p>
            ) : null}

            {match.category ? <p className="mt-1 text-sm text-font-secondary">Categoría: {match.category}</p> : null}

            {match.club_score !== null && match.opponent_score !== null ? (
              <p className="mt-2 text-sm font-medium text-font-main">
                Resultado: {teams.homeScore} - {teams.awayScore}
              </p>
            ) : null}
          </div>

          <div className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-font-secondary dark:bg-white/10">
            {match.is_public ? "Público" : "Privado"}
          </div>
        </div>
      </div>
    </Card>
  );
}

function getTeams({ clubName, match }: { clubName: string; match: DashboardMatchEvent }) {
  if (match.club_side === "away") {
    return {
      home: match.opponent_name,
      away: clubName,
      homeScore: match.opponent_score,
      awayScore: match.club_score,
    };
  }

  return {
    home: clubName,
    away: match.opponent_name,
    homeScore: match.club_score,
    awayScore: match.opponent_score,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}
