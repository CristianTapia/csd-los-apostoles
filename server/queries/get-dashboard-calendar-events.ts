import type { ActionResult } from "@/server/actions/types";
import { getActiveDashboardClub } from "@/server/queries/get-active-dashboard-club";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ClubEventStatus, ClubEventType } from "@/server/schemas/calendar-event";

export type DashboardCalendarEvent = {
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
  is_public: boolean;
};

export async function getDashboardCalendarEvents(): Promise<
  ActionResult<{
    club: {
      id: string;
      name: string;
      slug: string;
    };
    events: DashboardCalendarEvent[];
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

  const { data: events, error } = await supabase
    .from("club_events")
    .select(
      "id, title, description, event_type, status, starts_at, ends_at, location, opponent, home_score, away_score, is_public",
    )
    .eq("club_id", club.id)
    .order("starts_at", { ascending: true })
    .limit(100);

  if (error) {
    return {
      ok: false,
      message: "No se pudieron obtener los eventos del calendario.",
    };
  }

  return {
    ok: true,
    data: {
      club: {
        id: club.id,
        name: club.name,
        slug: club.slug,
      },
      events: events ?? [],
    },
  };
}
