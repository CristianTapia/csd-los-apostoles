"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import { updateClubSettingsSchema } from "@/server/schemas/club-settings";
import { getActiveClubSettings } from "@/server/queries/get-active-club-settings";

export async function updateClubSettingsAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = updateClubSettingsSchema.safeParse({
    public_name: formData.get("public_name"),
    primary_color: formData.get("primary_color"),
    secondary_color: formData.get("secondary_color"),
    accent_color: formData.get("accent_color"),
    logo_url: formData.get("logo_url"),
    cover_image_url: formData.get("cover_image_url"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los campos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const activeClubResult = await getActiveClubSettings();

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

  const { error } = await supabase.from("club_settings").upsert(
    {
      club_id: club.id,
      public_name: parsed.data.public_name,
      primary_color: parsed.data.primary_color,
      secondary_color: parsed.data.secondary_color,
      accent_color: parsed.data.accent_color,
      logo_url: parsed.data.logo_url,
      cover_image_url: parsed.data.cover_image_url,
    },
    {
      onConflict: "club_id",
    },
  );

  if (error) {
    return {
      ok: false,
      message: "No se pudo guardar la configuración del club.",
    };
  }

  revalidatePath("/dashboard/configuracion");
  revalidatePath(`/${club.slug}`);

  return {
    ok: true,
    message: "Configuración guardada correctamente.",
  };
}
