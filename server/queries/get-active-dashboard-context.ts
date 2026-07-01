import "server-only";

import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/domain/roles";
import type { PublicClubModuleKey } from "@/server/queries/get-public-club-page";
import { getActiveDashboardClub, type ActiveDashboardClub } from "@/server/queries/get-active-dashboard-club";

export type DashboardRole = Extract<UserRole, "tenant_owner" | "tenant_admin">;

export type DashboardModule = {
  id: string;
  module: PublicClubModuleKey;
  label: string;
  sort_order: number;
};

export type ActiveDashboardContext = {
  user: User;
  club: ActiveDashboardClub;
  role: DashboardRole;
  modules: DashboardModule[];
};

export type DashboardContextResult =
  | { ok: true; data: ActiveDashboardContext }
  | { ok: false; reason: "not_configured" | "unauthenticated" | "forbidden"; message: string };

async function resolveActiveDashboardContext(): Promise<DashboardContextResult> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      reason: "not_configured",
      message: "Supabase no estÃ¡ configurado.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      reason: "unauthenticated",
      message: "Debes iniciar sesiÃ³n.",
    };
  }

  const activeClubResult = await getActiveDashboardClub();

  if (!activeClubResult.ok || !activeClubResult.data) {
    return {
      ok: false,
      reason: "forbidden",
      message: activeClubResult.message ?? "No se pudo resolver el club activo.",
    };
  }

  const { club } = activeClubResult.data;

  const { data: role, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("club_id", club.id)
    .in("role", ["tenant_owner", "tenant_admin"])
    .limit(1)
    .maybeSingle();

  if (roleError || !role) {
    return {
      ok: false,
      reason: "forbidden",
      message: "No tienes permisos para administrar este club.",
    };
  }

  const { data: modules, error: modulesError } = await supabase
    .from("club_modules")
    .select("id, module, label, sort_order")
    .eq("club_id", club.id)
    .eq("is_allowed", true)
    .order("sort_order", { ascending: true });

  if (modulesError) {
    return {
      ok: false,
      reason: "forbidden",
      message: "No se pudieron cargar los mÃ³dulos del dashboard.",
    };
  }

  return {
    ok: true,
    data: {
      user,
      club,
      role: role.role as DashboardRole,
      modules: (modules ?? []).map((item) => ({
        id: item.id,
        module: item.module as PublicClubModuleKey,
        label: item.label,
        sort_order: item.sort_order,
      })),
    },
  };
}

export const getActiveDashboardContext = cache(resolveActiveDashboardContext);

export async function requireDashboardModule(module: PublicClubModuleKey): Promise<DashboardContextResult> {
  const context = await getActiveDashboardContext();

  if (!context.ok) {
    return context;
  }

  const isAllowed = context.data.modules.some((item) => item.module === module);

  if (!isAllowed) {
    return {
      ok: false,
      reason: "forbidden",
      message: "Este mÃ³dulo no estÃ¡ disponible para este club.",
    };
  }

  return context;
}
