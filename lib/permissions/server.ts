import "server-only";

import { getCurrentUser, getUserRoles, type UserRoleAssignment } from "@/lib/auth/server";
import { CLUB_ADMIN_ROLES, type UserRole } from "@/lib/domain/roles";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PermissionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_configured" | "unauthenticated" | "forbidden"; message: string };

export type ActiveClub = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

function hasAdminRole(roles: UserRoleAssignment[]) {
  return roles.some((role) => role.club_id && CLUB_ADMIN_ROLES.includes(role.role));
}

export async function isSuperAdmin(userId?: string): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.some((role) => role.role === "superadmin" && role.club_id === null);
}

export async function requireSuperAdmin(): Promise<PermissionResult<{ userId: string; roles: UserRoleAssignment[] }>> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { ok: false, reason: "not_configured", message: "Supabase no esta configurado." };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, reason: "unauthenticated", message: "Debes iniciar sesion." };
  }

  const roles = await getUserRoles(user.id);
  const allowed = roles.some((role) => role.role === "superadmin" && role.club_id === null);

  if (!allowed) {
    return { ok: false, reason: "forbidden", message: "No tienes permisos de superadmin." };
  }

  return { ok: true, data: { userId: user.id, roles } };
}

export async function requireClubRole(
  clubId: string,
  allowedRoles: UserRole[] = CLUB_ADMIN_ROLES,
): Promise<PermissionResult<{ userId: string; roles: UserRoleAssignment[] }>> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { ok: false, reason: "not_configured", message: "Supabase no esta configurado." };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { ok: false, reason: "unauthenticated", message: "Debes iniciar sesion." };
  }

  const roles = await getUserRoles(user.id);
  const allowed =
    roles.some((role) => role.role === "superadmin" && role.club_id === null) ||
    roles.some((role) => role.club_id === clubId && allowedRoles.includes(role.role));

  if (!allowed) {
    return { ok: false, reason: "forbidden", message: "No tienes permisos para administrar este club." };
  }

  return { ok: true, data: { userId: user.id, roles } };
}

export async function getActiveClubForUser(userId?: string): Promise<ActiveClub | null> {
  const supabase = await getSupabaseServerClient();
  const roles = await getUserRoles(userId);
  const clubRole = roles.find((role) => role.club_id && CLUB_ADMIN_ROLES.includes(role.role));

  if (!supabase || !clubRole?.club_id) {
    return null;
  }

  const { data } = await supabase
    .from("clubs")
    .select("id,name,slug,status")
    .eq("id", clubRole.club_id)
    .maybeSingle();

  return (data as ActiveClub | null) ?? null;
}

export async function getAdminAccessContext() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      configured: false,
      userId: null,
      roles: [] as UserRoleAssignment[],
      activeClub: null,
      isSuperAdmin: false,
      canAccessAdmin: false,
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      configured: true,
      userId: null,
      roles: [] as UserRoleAssignment[],
      activeClub: null,
      isSuperAdmin: false,
      canAccessAdmin: false,
    };
  }

  const roles = await getUserRoles(user.id);
  const superAdmin = roles.some((role) => role.role === "superadmin" && role.club_id === null);
  const canAccessAdmin = superAdmin || hasAdminRole(roles);
  const activeClub = canAccessAdmin ? await getActiveClubForUser(user.id) : null;

  return {
    configured: true,
    userId: user.id,
    roles,
    activeClub,
    isSuperAdmin: superAdmin,
    canAccessAdmin,
  };
}
