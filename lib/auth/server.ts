import "server-only";

import type { User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/domain/roles";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
};

export type UserRoleAssignment = {
  id: string;
  user_id: string;
  club_id: string | null;
  role: UserRole;
  created_at: string;
};

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase || !user) {
    return null;
  }

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  return (data as Profile | null) ?? null;
}

export async function getUserRoles(userId?: string): Promise<UserRoleAssignment[]> {
  const supabase = await getSupabaseServerClient();
  const user = userId ? null : await getCurrentUser();
  const targetUserId = userId ?? user?.id;

  if (!supabase || !targetUserId) {
    return [];
  }

  const { data } = await supabase
    .from("user_roles")
    .select("id,user_id,club_id,role,created_at")
    .eq("user_id", targetUserId);

  return (data as UserRoleAssignment[] | null) ?? [];
}
