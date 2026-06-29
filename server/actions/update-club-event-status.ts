"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import { getActiveDashboardClub } from "@/server/queries/get-active-dashboard-club";
import { updateClubEventStatusSchema } from "@/server/schemas/club-event";

export async function updateClubEventStatusAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = updateClubEventStatusSchema.safeParse({
    event_id: formData.get("event_id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa el estado del evento.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

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

  const values = parsed.data;

  const { data: event, error: eventError } = await supabase
    .from("club_events")
    .select("id, event_type")
    .eq("id", values.event_id)
    .eq("club_id", club.id)
    .neq("event_type", "match")
    .maybeSingle();

  if (eventError || !event) {
    return {
      ok: false,
      message: "Evento no encontrado o sin permisos.",
    };
  }

  const { error } = await supabase
    .from("club_events")
    .update({
      status: values.status,
    })
    .eq("id", values.event_id)
    .eq("club_id", club.id);

  if (error) {
    return {
      ok: false,
      message: "No se pudo actualizar el estado del evento.",
    };
  }

  revalidatePath("/dashboard/eventos");
  revalidatePath("/dashboard/calendario");
  revalidatePath(`/${club.slug}`);
  revalidatePath(`/${club.slug}/calendario`);

  return {
    ok: true,
    message: "Estado actualizado correctamente.",
  };
}
