"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireSuperAdmin } from "@/lib/permissions/server";
import type { ActionResult } from "@/server/actions/types";
import { createAdminClubSchema } from "@/server/schemas/admin-club";

export type CreatedAdminClub = {
  id: string;
  name: string;
  slug: string;
};

export async function createAdminClubAction(
  _prevState: ActionResult<CreatedAdminClub>,
  formData: FormData,
): Promise<ActionResult<CreatedAdminClub>> {
  const parsed = createAdminClubSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    owner_email: formData.get("owner_email"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los datos del club.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const access = await requireSuperAdmin();

  if (!access.ok) {
    return {
      ok: false,
      message: access.message,
    };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase no esta configurado.",
    };
  }

  const { data, error } = await supabase
    .rpc("create_club_with_owner", {
      p_name: parsed.data.name,
      p_slug: parsed.data.slug,
      p_owner_email: parsed.data.owner_email,
    })
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: getCreateClubErrorMessage(error?.message, error?.code),
    };
  }

  const club = data as CreatedAdminClub;

  revalidatePath("/admin/clubes");
  revalidatePath("/admin/modulos");
  revalidatePath(`/${club.slug}`);

  return {
    ok: true,
    data: club,
    message: `Club ${club.name} creado correctamente.`,
  };
}

function getCreateClubErrorMessage(message = "", code = "") {
  if (message.includes("OWNER_PROFILE_NOT_FOUND")) {
    return "No existe un profile para el email del owner. Crea el usuario en Auth antes de asignarlo.";
  }

  if (message.includes("CLUB_SLUG_ALREADY_EXISTS") || code === "23505") {
    return "Ya existe un club con ese slug.";
  }

  if (message.includes("PERMISSION_DENIED")) {
    return "No tienes permisos para crear clubes.";
  }

  return "No se pudo crear el club.";
}
