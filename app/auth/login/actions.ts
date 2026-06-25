"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/server/schemas/auth";
import type { ActionResult } from "@/server/actions/types";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function loginAction(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || "/admin",
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
    console.error("[loginAction] Supabase login error", {
      email: parsed.data.email,
      message: error.message,
      status: error.status,
      code: error.code,
      name: error.name,
    });

    return {
      ok: false,
      message:
        process.env.NODE_ENV === "development" ? `Error Supabase: ${error.message}` : "Email o password incorrectos.",
    };
  }

  console.log("[loginAction] Login success", {
    email: parsed.data.email,
    hasUser: Boolean(data.user),
    hasSession: Boolean(data.session),
  });

  redirect(parsed.data.next?.startsWith("/") ? parsed.data.next : "/admin");
}

export async function logoutAction(): Promise<void> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect("/auth/login");
  }

  await supabase.auth.signOut();
  redirect("/auth/login");
}
