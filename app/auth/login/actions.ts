"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/server/schemas/auth";
import type { ActionResult } from "@/server/actions/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/domain/roles";

type RoleRow = {
  role: UserRole;
  club_id: string | null;
};

function isSafeNextPath(nextPath?: string) {
  return Boolean(nextPath?.startsWith("/") && !nextPath.startsWith("//"));
}

function getRedirectPath(nextPath: string | undefined, roles: RoleRow[]) {
  const isSuperAdmin = roles.some((role) => role.role === "superadmin" && role.club_id === null);
  const isTenantAdmin = roles.some(
    (role) => role.club_id && (role.role === "tenant_owner" || role.role === "tenant_admin"),
  );

  if (isSafeNextPath(nextPath)) {
    if (nextPath?.startsWith("/admin") && isSuperAdmin) {
      return nextPath;
    }

    if (nextPath?.startsWith("/dashboard") && isTenantAdmin) {
      return nextPath;
    }
  }

  if (isSuperAdmin) {
    return "/admin";
  }

  if (isTenantAdmin) {
    return "/dashboard";
  }

  return "/auth/login";
}

export async function loginAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Revisa los campos del formulario.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { ok: false, message: "Supabase no esta configurado." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, message: "Email o password incorrectos." };
  }

  if (!data.user) {
    return { ok: false, message: "No se pudo iniciar sesion." };
  }

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role,club_id")
    .eq("user_id", data.user.id);

  redirect(getRedirectPath(parsed.data.next, (roles as RoleRow[] | null) ?? []));
}

export async function logoutAction(): Promise<void> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect("/auth/login");
  }

  await supabase.auth.signOut();
  redirect("/auth/login");
}
