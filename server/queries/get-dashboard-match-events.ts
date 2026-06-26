import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import { getActiveDashboardClub } from "@/server/queries/get-active-dashboard-club";
import type { ClubEventStatus, ClubMatchSide } from "@/server/schemas/calendar-event";

export type DashboardMatchEvent = {
  id: string;
  title: string;
  status: ClubEventStatus;
  starts_at: string;
  location: string | null;
  location_url: string | null;
  is_public: boolean;

  club_side: ClubMatchSide;
  opponent_name: string;
  competition_name: string | null;
  category: string | null;
  club_score: number | null;
  opponent_score: number | null;
  club_kit_color: string | null;
  opponent_kit_color: string | null;
};

export async function getDashboardMatchEvents(): Promise<
  ActionResult<{
    club: {
      id: string;
      name: string;
      slug: string;
    };
    matches: DashboardMatchEvent[];
  }>
> {
  const activeClubResult = await getActiveDashboardClub();

  if (!activeClubResult.ok || !activeClubResult.data) {
    return {
      ok: false,
      message: activeClubResult.message ?? "No se pudo resolver el club activo.",
    };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase no está configurado.",
    };
  }

  const { club } = activeClubResult.data;

  const { data: events, error: eventsError } = await supabase
    .from("club_events")
    .select("id, title, status, starts_at, location, location_url, is_public")
    .eq("club_id", club.id)
    .eq("event_type", "match")
    .order("starts_at", { ascending: true })
    .limit(100);

  if (eventsError) {
    return {
      ok: false,
      message: "No se pudieron obtener los partidos.",
    };
  }

  const eventIds = (events ?? []).map((event) => event.id);

  if (eventIds.length === 0) {
    return {
      ok: true,
      data: {
        club: {
          id: club.id,
          name: club.name,
          slug: club.slug,
        },
        matches: [],
      },
    };
  }

  const { data: details, error: detailsError } = await supabase
    .from("club_match_details")
    .select(
      "event_id, club_side, opponent_name, competition_name, category, club_score, opponent_score, club_kit_color, opponent_kit_color",
    )
    .in("event_id", eventIds);

  if (detailsError) {
    return {
      ok: false,
      message: "No se pudieron obtener los detalles de los partidos.",
    };
  }

  const detailsByEventId = new Map((details ?? []).map((detail) => [detail.event_id, detail]));

  const matches: DashboardMatchEvent[] = [];

  for (const event of events ?? []) {
    const detail = detailsByEventId.get(event.id);

    if (!detail) continue;

    matches.push({
      id: event.id,
      title: event.title,
      status: event.status,
      starts_at: event.starts_at,
      location: event.location,
      location_url: event.location_url,
      is_public: event.is_public,

      club_side: detail.club_side,
      opponent_name: detail.opponent_name,
      competition_name: detail.competition_name,
      category: detail.category,
      club_score: detail.club_score,
      opponent_score: detail.opponent_score,
      club_kit_color: detail.club_kit_color,
      opponent_kit_color: detail.opponent_kit_color,
    });
  }

  return {
    ok: true,
    data: {
      club: {
        id: club.id,
        name: club.name,
        slug: club.slug,
      },
      matches,
    },
  };
}
