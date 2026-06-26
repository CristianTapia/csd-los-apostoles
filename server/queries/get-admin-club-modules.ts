import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";

export type AdminClubModule = {
  id: string;
  module: string;
  label: string;
  is_allowed: boolean;
  sort_order: number;
};

export type AdminClubWithModules = {
  id: string;
  name: string;
  slug: string;
  status: string;
  modules: AdminClubModule[];
};

type AdminClubModulesResult = {
  clubs: AdminClubWithModules[];
};

export async function getAdminClubModules(): Promise<ActionResult<AdminClubModulesResult>> {
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

  const { data: clubs, error: clubsError } = await supabase
    .from("clubs")
    .select("id, name, slug, status")
    .order("name", { ascending: true });

  if (clubsError) {
    return {
      ok: false,
      message: "No se pudieron obtener los clubes.",
    };
  }

  const clubIds = (clubs ?? []).map((club) => club.id);

  if (clubIds.length === 0) {
    return {
      ok: true,
      data: {
        clubs: [],
      },
    };
  }

  const { data: modules, error: modulesError } = await supabase
    .from("club_modules")
    .select("id, club_id, module, label, is_allowed, sort_order")
    .in("club_id", clubIds)
    .order("sort_order", { ascending: true });

  if (modulesError) {
    return {
      ok: false,
      message: "No se pudieron obtener los módulos.",
    };
  }

  const modulesByClubId = new Map<string, AdminClubModule[]>();

  for (const clubModule of modules ?? []) {
    const current = modulesByClubId.get(clubModule.club_id) ?? [];

    current.push({
      id: clubModule.id,
      module: clubModule.module,
      label: clubModule.label,
      is_allowed: clubModule.is_allowed,
      sort_order: clubModule.sort_order,
    });

    modulesByClubId.set(clubModule.club_id, current);
  }

  return {
    ok: true,
    data: {
      clubs: (clubs ?? []).map((club) => ({
        ...club,
        modules: modulesByClubId.get(club.id) ?? [],
      })),
    },
  };
}
