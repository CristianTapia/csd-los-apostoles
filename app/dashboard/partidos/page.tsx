import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { MatchEventForm } from "./MatchEventForm";
import { MatchKitColorForm } from "./MatchKitColorForm";
import { MatchQuickUpdateForm } from "./MatchQuickUpdateForm";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { CLUB_EVENT_STATUS_LABELS, CLUB_MATCH_SIDE_LABELS } from "@/server/schemas/calendar-event";
import { requireDashboardModule } from "@/server/queries/get-active-dashboard-context";
import { getDashboardMatchEvents, type DashboardMatchEvent } from "@/server/queries/get-dashboard-match-events";

export default async function DashboardPartidosPage() {
  const moduleAccess = await requireDashboardModule("partidos");

  if (!moduleAccess.ok) {
    notFound();
  }

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
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-font-secondary">
              Partido · {CLUB_EVENT_STATUS_LABELS[match.status]} · {CLUB_MATCH_SIDE_LABELS[match.club_side]}
            </p>

            <h2 className="mt-1 text-lg font-semibold text-font-main">
              {teams.home.name} vs {teams.away.name}
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
          </div>

          <div className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-font-secondary dark:bg-white/10">
            Público
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <TeamBlock name={teams.home.name} label="Local" kitColor={teams.home.kitColor} />

            <div className="flex items-center justify-center rounded-2xl bg-black/[0.03] px-5 py-4 dark:bg-white/[0.06]">
              {teams.home.score !== null && teams.away.score !== null ? (
                <p className="text-3xl font-bold text-font-main">
                  {teams.home.score} - {teams.away.score}
                </p>
              ) : (
                <p className="text-sm font-medium text-font-secondary">Sin marcador</p>
              )}
            </div>

            <TeamBlock name={teams.away.name} label="Visita" kitColor={teams.away.kitColor} alignRight />
          </div>
        </div>

        <MatchKitColorForm match={match} />
        <MatchQuickUpdateForm match={match} />
      </div>
    </Card>
  );
}

function TeamBlock({
  name,
  label,
  kitColor,
  alignRight = false,
}: {
  name: string;
  label: string;
  kitColor: string | null;
  alignRight?: boolean;
}) {
  return (
    <div className={alignRight ? "flex items-center gap-3 sm:justify-end" : "flex items-center gap-3"}>
      {!alignRight ? <KitColorDot color={kitColor} /> : null}

      <div className={alignRight ? "text-left sm:text-right" : undefined}>
        <p className="text-xs font-medium uppercase tracking-wide text-font-secondary">{label}</p>

        <p className="mt-1 text-base font-semibold text-font-main">{name}</p>
      </div>

      {alignRight ? <KitColorDot color={kitColor} /> : null}
    </div>
  );
}

function KitColorDot({ color }: { color: string | null }) {
  if (!color) {
    return (
      <span className="h-9 w-9 rounded-full border border-dashed border-black/30 bg-white dark:border-white/30 dark:bg-neutral-900" />
    );
  }

  return (
    <span
      className="h-9 w-9 rounded-full border border-black/15 shadow-sm dark:border-white/20"
      style={{ backgroundColor: color } as CSSProperties}
    />
  );
}

function getTeams({ clubName, match }: { clubName: string; match: DashboardMatchEvent }) {
  if (match.club_side === "away") {
    return {
      home: {
        name: match.opponent_name,
        score: match.opponent_score,
        kitColor: match.opponent_kit_color,
      },
      away: {
        name: clubName,
        score: match.club_score,
        kitColor: match.club_kit_color,
      },
    };
  }

  return {
    home: {
      name: clubName,
      score: match.club_score,
      kitColor: match.club_kit_color,
    },
    away: {
      name: match.opponent_name,
      score: match.opponent_score,
      kitColor: match.opponent_kit_color,
    },
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}
