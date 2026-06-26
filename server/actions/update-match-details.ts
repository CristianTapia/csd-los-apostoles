"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import { getActiveDashboardClub } from "@/server/queries/get-active-dashboard-club";
import { updateMatchDetailsSchema } from "@/server/schemas/calendar-event";

export async function updateMatchDetailsAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = updateMatchDetailsSchema.safeParse({
    event_id: formData.get("event_id"),
    status: formData.get("status"),
    club_score: formData.get("club_score"),
    opponent_score: formData.get("opponent_score"),
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

  const { data: matchEvent, error: matchEventError } = await supabase
    .from("club_events")
    .select("id, status")
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

  const { data: updatedEvent, error: eventUpdateError } = await supabase
    .from("club_events")
    .update({
      status: values.status,
    })
    .eq("id", matchEvent.id)
    .eq("club_id", club.id)
    .eq("event_type", "match")
    .select("id, status")
    .single();

  if (eventUpdateError || !updatedEvent) {
    return {
      ok: false,
      message: "No se pudo actualizar el estado del partido.",
    };
  }

  if (updatedEvent.status !== values.status) {
    return {
      ok: false,
      message: "El estado del partido no quedó guardado correctamente.",
    };
  }

  const { error: detailsUpdateError } = await supabase
    .from("club_match_details")
    .update({
      club_score: values.club_score,
      opponent_score: values.opponent_score,
    })
    .eq("event_id", matchEvent.id);

  if (detailsUpdateError) {
    return {
      ok: false,
      message: "No se pudo actualizar el marcador del partido.",
    };
  }

  revalidatePath("/dashboard/partidos");
  revalidatePath("/dashboard/calendario");
  revalidatePath(`/${club.slug}`);
  revalidatePath(`/${club.slug}/calendario`);
  revalidatePath(`/${club.slug}/partidos`);

  return {
    ok: true,
    message: "Partido actualizado correctamente.",
  };
}
