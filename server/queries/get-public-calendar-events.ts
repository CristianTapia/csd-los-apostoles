import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import type { ClubEventStatus, ClubEventType, ClubMatchSide } from "@/server/schemas/calendar-event";

export type PublicMatchDetails = {
  club_side: ClubMatchSide;
  opponent_name: string;
  competition_name: string | null;
  category: string | null;
  club_score: number | null;
  opponent_score: number | null;
  club_kit_color: string | null;
  opponent_kit_color: string | null;
};

export type PublicCalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  event_type: ClubEventType;
  status: ClubEventStatus;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  location_url: string | null;
  opponent: string | null;
  home_score: number | null;
  away_score: number | null;
  match_details: PublicMatchDetails | null;
};

export async function getPublicCalendarEvents(clubSlug: string): Promise<
  ActionResult<{
    club: {
      id: string;
      name: string;
      slug: string;
    };
    events: PublicCalendarEvent[];
  }>
> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase no está configurado.",
    };
  }

  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, name, slug")
    .eq("slug", clubSlug)
    .eq("status", "active")
    .maybeSingle();

  if (clubError || !club) {
    return {
      ok: false,
      message: "Club no encontrado.",
    };
  }

  const { data: events, error: eventsError } = await supabase
    .from("club_events")
    .select(
      "id, title, description, event_type, status, starts_at, ends_at, location, location_url, opponent, home_score, away_score",
    )
    .eq("club_id", club.id)
    .eq("is_public", true)
    .order("starts_at", { ascending: true })
    .limit(100);

  if (eventsError) {
    return {
      ok: false,
      message: "No se pudieron obtener los eventos públicos.",
    };
  }

  const matchEventIds = (events ?? []).filter((event) => event.event_type === "match").map((event) => event.id);

  const matchDetailsByEventId = new Map<string, PublicMatchDetails>();

  if (matchEventIds.length > 0) {
    const { data: matchDetails, error: matchDetailsError } = await supabase
      .from("club_match_details")
      .select(
        "event_id, club_side, opponent_name, competition_name, category, club_score, opponent_score, club_kit_color, opponent_kit_color",
      )
      .in("event_id", matchEventIds);

    if (matchDetailsError) {
      return {
        ok: false,
        message: "No se pudieron obtener los detalles de partidos.",
      };
    }

    for (const detail of matchDetails ?? []) {
      matchDetailsByEventId.set(detail.event_id, {
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
  }

  return {
    ok: true,
    data: {
      club,
      events: (events ?? []).map((event) => ({
        ...event,
        match_details: matchDetailsByEventId.get(event.id) ?? null,
      })),
    },
  };
}
