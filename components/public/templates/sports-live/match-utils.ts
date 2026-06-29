import type { PublicMatchDetails } from "@/server/queries/get-public-calendar-events";

export type SportsLiveTeam = {
  name: string;
  score: number | null;
  kitColor: string | null;
  logoUrl: string | null;
  isTenantClub: boolean;
};

export function getMatchTeams({
  clubName,
  clubLogoUrl,
  details,
}: {
  clubName: string;
  clubLogoUrl: string | null;
  details: PublicMatchDetails;
}) {
  const tenantClub: SportsLiveTeam = {
    name: clubName,
    score: details.club_score,
    kitColor: details.club_kit_color,
    logoUrl: clubLogoUrl,
    isTenantClub: true,
  };

  const opponent: SportsLiveTeam = {
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

export function getResultLabel({
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

export function getInitials(value: string) {
  return value
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
  }).format(new Date(value));
}
