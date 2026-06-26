"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";
import { updateAdminClubModulesSchema } from "@/server/schemas/admin-club-modules";

export async function updateAdminClubModulesAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const allowedModuleIds = formData
    .getAll("allowed_modules")
    .filter((value): value is string => typeof value === "string");

  const parsed = updateAdminClubModulesSchema.safeParse({
    club_id: formData.get("club_id"),
    allowed_module_ids: allowedModuleIds,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los módulos seleccionados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase no está configurado.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      message: "Debes iniciar sesión.",
    };
  }

  const { data: superadminRole, error: roleError } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "superadmin")
    .is("club_id", null)
    .maybeSingle();

  if (roleError || !superadminRole) {
    return {
      ok: false,
      message: "No tienes permisos para administrar módulos.",
    };
  }

  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, slug")
    .eq("id", parsed.data.club_id)
    .maybeSingle();

  if (clubError || !club) {
    return {
      ok: false,
      message: "Club no encontrado.",
    };
  }

  const { data: modules, error: modulesError } = await supabase
    .from("club_modules")
    .select("id, module")
    .eq("club_id", club.id);

  if (modulesError) {
    return {
      ok: false,
      message: "No se pudieron validar los módulos del club.",
    };
  }

  const moduleIds = new Set((modules ?? []).map((item) => item.id));
  const selectedIds = new Set(parsed.data.allowed_module_ids);

  const hasInvalidModule = [...selectedIds].some((id) => !moduleIds.has(id));

  if (hasInvalidModule) {
    return {
      ok: false,
      message: "No puedes modificar módulos de otro club.",
    };
  }

  for (const clubModule of modules ?? []) {
    const { error } = await supabase
      .from("club_modules")
      .update({
        is_allowed: selectedIds.has(clubModule.id),
      })
      .eq("id", clubModule.id)
      .eq("club_id", club.id);

    if (error) {
      return {
        ok: false,
        message: "No se pudieron guardar los módulos del club.",
      };
    }
  }

  revalidatePath("/admin/modulos");
  revalidatePath(`/${club.slug}`);

  for (const clubModule of modules ?? []) {
    revalidatePath(`/${club.slug}/${clubModule.module}`);
  }

  return {
    ok: true,
    message: "Módulos del club actualizados correctamente.",
  };
}
