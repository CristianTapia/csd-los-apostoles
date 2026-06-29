"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import { getActiveDashboardClub } from "@/server/queries/get-active-dashboard-club";
import { createClubEventSchema } from "@/server/schemas/club-event";

export async function createClubEventAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = createClubEventSchema.safeParse({
    title: formData.get("title"),
    event_type: formData.get("event_type"),
    starts_at: formData.get("starts_at"),
    ends_at: formData.get("ends_at"),
    location: formData.get("location"),
    location_url: formData.get("location_url"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los campos del evento.",
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

  const { error } = await supabase.from("club_events").insert({
    club_id: club.id,
    title: values.title,
    description: values.description,
    event_type: values.event_type,
    status: "scheduled",
    starts_at: new Date(values.starts_at).toISOString(),
    ends_at: values.ends_at ? new Date(values.ends_at).toISOString() : null,
    location: values.location,
    location_url: values.location_url,
    is_public: true,
  });

  if (error) {
    return {
      ok: false,
      message: "No se pudo crear el evento.",
    };
  }

  revalidatePath("/dashboard/eventos");
  revalidatePath("/dashboard/calendario");
  revalidatePath(`/${club.slug}`);
  revalidatePath(`/${club.slug}/calendario`);

  return {
    ok: true,
    message: "Evento creado correctamente.",
  };
}
