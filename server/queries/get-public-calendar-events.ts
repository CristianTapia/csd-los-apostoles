import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import type { ClubEventStatus, ClubEventType } from "@/server/schemas/calendar-event";

export type PublicCalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  event_type: ClubEventType;
  status: ClubEventStatus;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  opponent: string | null;
  home_score: number | null;
  away_score: number | null;
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
      "id, title, description, event_type, status, starts_at, ends_at, location, opponent, home_score, away_score",
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

  return {
    ok: true,
    data: {
      club,
      events: events ?? [],
    },
  };
}
