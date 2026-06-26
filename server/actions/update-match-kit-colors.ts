"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import { getActiveDashboardClub } from "@/server/queries/get-active-dashboard-club";
import { updateMatchKitColorsSchema } from "@/server/schemas/calendar-event";

export async function updateMatchKitColorsAction(input: unknown): Promise<ActionResult> {
  const parsed = updateMatchKitColorsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Selecciona colores válidos.",
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

  const { data: matchEvent, error: matchEventError } = await supabase
    .from("club_events")
    .select("id")
    .eq("id", values.event_id)
    .eq("club_id", club.id)
    .eq("event_type", "match")
    .maybeSingle();

  if (matchEventError || !matchEvent) {
    return {
      ok: false,
      message: "Partido no encontrado o sin permisos.",
    };
  }

  const { error } = await supabase
    .from("club_match_details")
    .update({
      club_kit_color: values.club_kit_color,
      opponent_kit_color: values.opponent_kit_color,
    })
    .eq("event_id", matchEvent.id);

  if (error) {
    return {
      ok: false,
      message: "No se pudieron actualizar los colores.",
    };
  }

  revalidatePath("/dashboard/partidos");
  revalidatePath("/dashboard/calendario");
  revalidatePath(`/${club.slug}`);
  revalidatePath(`/${club.slug}/calendario`);
  revalidatePath(`/${club.slug}/partidos`);

  return {
    ok: true,
    message: "Colores actualizados.",
  };
}
