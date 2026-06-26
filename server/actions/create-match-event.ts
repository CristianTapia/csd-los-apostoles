"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import { getActiveDashboardClub } from "@/server/queries/get-active-dashboard-club";
import { createMatchEventSchema } from "@/server/schemas/calendar-event";

export async function createMatchEventAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = createMatchEventSchema.safeParse({
    starts_at: formData.get("starts_at"),
    club_side: formData.get("club_side"),
    opponent_name: formData.get("opponent_name"),
    location: formData.get("location"),
    location_url: formData.get("location_url"),
    competition_name: formData.get("competition_name"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los datos del partido.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

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
  const values = parsed.data;

  const title = buildMatchTitle({
    clubName: club.name,
    opponentName: values.opponent_name,
    clubSide: values.club_side,
  });

  const { data: event, error: eventError } = await supabase
    .from("club_events")
    .insert({
      club_id: club.id,
      title,
      event_type: "match",
      status: "scheduled",
      starts_at: new Date(values.starts_at).toISOString(),
      ends_at: null,
      location: values.location,
      location_url: values.location_url,
      is_public: true,
    })
    .select("id")
    .single();

  if (eventError || !event) {
    return {
      ok: false,
      message: "No se pudo crear el partido.",
    };
  }

  const { error: detailsError } = await supabase.from("club_match_details").insert({
    event_id: event.id,
    club_side: values.club_side,
    opponent_name: values.opponent_name,
    competition_name: values.competition_name,
    category: values.category,
    club_score: null,
    opponent_score: null,
    club_kit_color: null,
    opponent_kit_color: null,
  });

  if (detailsError) {
    await supabase.from("club_events").delete().eq("id", event.id).eq("club_id", club.id);

    return {
      ok: false,
      message: "No se pudieron guardar los detalles del partido.",
    };
  }

  revalidatePath("/dashboard/partidos");
  revalidatePath("/dashboard/calendario");
  revalidatePath(`/${club.slug}`);
  revalidatePath(`/${club.slug}/calendario`);
  revalidatePath(`/${club.slug}/partidos`);

  return {
    ok: true,
    message: "Partido creado correctamente.",
  };
}

function buildMatchTitle({
  clubName,
  opponentName,
  clubSide,
}: {
  clubName: string;
  opponentName: string;
  clubSide: "home" | "away" | "neutral";
}) {
  if (clubSide === "away") {
    return `${opponentName} vs ${clubName}`;
  }

  return `${clubName} vs ${opponentName}`;
}
