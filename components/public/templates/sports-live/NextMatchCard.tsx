import { MapPin } from "lucide-react";
import { PublicCard } from "@/components/public/PublicCard";
import { CLUB_EVENT_STATUS_LABELS } from "@/server/schemas/calendar-event";
import type { PublicCalendarEvent } from "@/server/queries/get-public-calendar-events";
import { PublicKitColorDot, PublicTeamMark } from "./PublicTeamMark";
import { formatDate, getMatchTeams, type SportsLiveTeam } from "./match-utils";

type NextMatchCardProps = {
  event: PublicCalendarEvent;
  clubName: string;
  clubLogoUrl: string | null;
};

export function NextMatchCard({ event, clubName, clubLogoUrl }: NextMatchCardProps) {
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

function HomeTeamBlock({ team, alignRight = false }: { team: SportsLiveTeam; alignRight?: boolean }) {
  return (
    <div className={alignRight ? "min-w-0 text-left sm:text-right" : "min-w-0 text-left"}>
      <div className={alignRight ? "mb-2 flex justify-start sm:justify-end" : "mb-2 flex justify-start"}>
        <PublicTeamMark name={team.name} logoUrl={team.logoUrl} />
      </div>

      <p className="break-words text-sm font-black leading-5 text-[var(--public-text)]">{team.name}</p>

      <div className={alignRight ? "mt-2 flex items-center gap-2 sm:justify-end" : "mt-2 flex items-center gap-2"}>
        <PublicKitColorDot color={team.kitColor} />
        <span className="text-xs text-[var(--public-text-muted)]">Camiseta</span>
      </div>
    </div>
  );
}
