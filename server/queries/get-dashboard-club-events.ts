import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import { getActiveDashboardClub } from "@/server/queries/get-active-dashboard-club";
import {
  NON_MATCH_CLUB_EVENT_TYPES,
  type DashboardClubEvent,
  type NonMatchClubEventType,
} from "@/server/schemas/club-event";
import type { ClubEventStatus } from "@/server/schemas/calendar-event";

export async function getDashboardClubEvents(): Promise<
  ActionResult<{
    club: {
      id: string;
      name: string;
      slug: string;
    };
    events: DashboardClubEvent[];
  }>
> {
  const activeClubResult = await getActiveDashboardClub();

  if (!activeClubResult.ok || !activeClubResult.data) {
    return {
      ok: false,
      message: activeClubResult.message ?? "No se pudo obtener el club activo.",
    };
  }

  const { club } = activeClubResult.data;

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase no está configurado.",
    };
  }

  const { data, error } = await supabase
    .from("club_events")
    .select("id, title, description, event_type, status, starts_at, ends_at, location, location_url, is_public")
    .eq("club_id", club.id)
    .in("event_type", [...NON_MATCH_CLUB_EVENT_TYPES])
    .order("starts_at", { ascending: true });

  if (error) {
    return {
      ok: false,
      message: "No se pudieron cargar los eventos.",
    };
  }

  return {
    ok: true,
    data: {
      club,
      events: (data ?? []).map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        event_type: event.event_type as NonMatchClubEventType,
        status: event.status as ClubEventStatus,
        starts_at: event.starts_at,
        ends_at: event.ends_at,
        location: event.location,
        location_url: event.location_url,
        is_public: event.is_public,
      })),
    },
  };
}
