import { PublicCard } from "@/components/public/PublicCard";
import type { PublicCalendarEvent } from "@/server/queries/get-public-calendar-events";
import { formatShortDate, getMatchTeams, getResultLabel } from "./match-utils";

type RecentMatchCardProps = {
  event: PublicCalendarEvent;
  clubName: string;
  clubLogoUrl: string | null;
};

export function RecentMatchCard({ event, clubName, clubLogoUrl }: RecentMatchCardProps) {
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
