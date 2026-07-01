import { getSupabaseServerClient } from "@/lib/supabase/server";
import { requireSuperAdmin } from "@/lib/permissions/server";
import type { ActionResult } from "@/server/actions/types";

export type AdminClubOwner = {
  id: string;
  email: string;
  full_name: string | null;
};

export type AdminClubListItem = {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
  public_name: string | null;
  owner: AdminClubOwner | null;
};

type AdminClubsResult = {
  clubs: AdminClubListItem[];
};

export async function getAdminClubs(): Promise<ActionResult<AdminClubsResult>> {
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

  const { data: clubs, error: clubsError } = await supabase
    .from("clubs")
    .select("id, name, slug, status, created_at")
    .order("created_at", { ascending: false });

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

  const [{ data: settings, error: settingsError }, { data: ownerRoles, error: ownerRolesError }] = await Promise.all([
    supabase.from("club_settings").select("club_id, public_name").in("club_id", clubIds),
    supabase.from("user_roles").select("club_id, user_id").eq("role", "tenant_owner").in("club_id", clubIds),
  ]);

  if (settingsError || ownerRolesError) {
    return {
      ok: false,
      message: "No se pudieron obtener los detalles de los clubes.",
    };
  }

  const ownerUserIds = [...new Set((ownerRoles ?? []).map((role) => role.user_id))];

  const { data: profiles, error: profilesError } =
    ownerUserIds.length > 0
      ? await supabase.from("profiles").select("id, email, full_name").in("id", ownerUserIds)
      : { data: [], error: null };

  if (profilesError) {
    return {
      ok: false,
      message: "No se pudieron obtener los owners de los clubes.",
    };
  }

  const settingsByClubId = new Map((settings ?? []).map((item) => [item.club_id, item]));
  const profilesById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const ownersByClubId = new Map<string, AdminClubOwner>();

  for (const role of ownerRoles ?? []) {
    if (ownersByClubId.has(role.club_id)) continue;

    const profile = profilesById.get(role.user_id);

    if (!profile) continue;

    ownersByClubId.set(role.club_id, {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
    });
  }

  return {
    ok: true,
    data: {
      clubs: (clubs ?? []).map((club) => ({
        id: club.id,
        name: club.name,
        slug: club.slug,
        status: club.status,
        created_at: club.created_at,
        public_name: settingsByClubId.get(club.id)?.public_name ?? null,
        owner: ownersByClubId.get(club.id) ?? null,
      })),
    },
  };
}
