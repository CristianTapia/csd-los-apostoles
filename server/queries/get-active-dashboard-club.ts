import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";

export type ActiveDashboardClub = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

export async function getActiveDashboardClub(): Promise<ActionResult<{ club: ActiveDashboardClub }>> {
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

  const { data: role, error: roleError } = await supabase
    .from("user_roles")
    .select("club_id, role")
    .eq("user_id", user.id)
    .in("role", ["tenant_owner", "tenant_admin"])
    .not("club_id", "is", null)
    .limit(1)
    .maybeSingle();

  if (roleError) {
    return {
      ok: false,
      message: "No se pudo validar tu rol en el club.",
    };
  }

  if (!role?.club_id) {
    return {
      ok: false,
      message: "No tienes un club activo asignado.",
    };
  }

  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, name, slug, status")
    .eq("id", role.club_id)
    .maybeSingle();

  if (clubError || !club) {
    return {
      ok: false,
      message: "No se pudo obtener el club activo.",
    };
  }

  if (club.status !== "active") {
    return {
      ok: false,
      message: "El club no está activo.",
    };
  }

  return {
    ok: true,
    data: {
      club,
    },
  };
}
