import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";

type TenantDashboardRole = "tenant_owner" | "tenant_admin";

type ClubSettings = {
  public_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string | null;
  cover_image_url: string | null;
};

type ActiveClubSettings = {
  role: TenantDashboardRole;
  club: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  settings: ClubSettings;
};

export async function getActiveClubSettings(): Promise<ActionResult<ActiveClubSettings>> {
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

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role, club_id")
    .eq("user_id", user.id)
    .in("role", ["tenant_owner", "tenant_admin"])
    .not("club_id", "is", null)
    .limit(1)
    .maybeSingle();

  if (roleError) {
    return {
      ok: false,
      message: "No se pudo obtener el rol del usuario.",
    };
  }

  if (!roleData?.club_id) {
    return {
      ok: false,
      message: "No tienes un club activo asociado.",
    };
  }

  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, name, slug, status")
    .eq("id", roleData.club_id)
    .maybeSingle();

  if (clubError || !club) {
    return {
      ok: false,
      message: "No se pudo obtener el club activo.",
    };
  }

  const { data: settings, error: settingsError } = await supabase
    .from("club_settings")
    .select("public_name, primary_color, secondary_color, accent_color, logo_url, cover_image_url")
    .eq("club_id", club.id)
    .maybeSingle();

  if (settingsError) {
    return {
      ok: false,
      message: "No se pudo obtener la configuración del club.",
    };
  }

  return {
    ok: true,
    data: {
      role: roleData.role as TenantDashboardRole,
      club,
      settings: {
        public_name: settings?.public_name ?? club.name,
        primary_color: settings?.primary_color ?? "#111827",
        secondary_color: settings?.secondary_color ?? "#f9fafb",
        accent_color: settings?.accent_color ?? "#22c55e",
        logo_url: settings?.logo_url ?? null,
        cover_image_url: settings?.cover_image_url ?? null,
      },
    },
  };
}
