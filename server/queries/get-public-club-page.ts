import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";

export type PublicClubModuleKey =
  | "transparencia"
  | "plantel"
  | "socios"
  | "tienda"
  | "actividades"
  | "campeonatos"
  | "calendario";

export type PublicClubModule = {
  module: PublicClubModuleKey;
  label: string;
  href: string;
  sort_order: number;
};

export type PublicClubPage = {
  club: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  settings: {
    public_name: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    logo_url: string | null;
    cover_image_url: string | null;
  };
  enabledModules: PublicClubModule[];
};

export async function getPublicClubPage(clubSlug: string): Promise<ActionResult<PublicClubPage>> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase no está configurado.",
    };
  }

  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, name, slug, status")
    .eq("slug", clubSlug)
    .eq("status", "active")
    .maybeSingle();

  if (clubError) {
    return {
      ok: false,
      message: "No se pudo obtener el club.",
    };
  }

  if (!club) {
    return {
      ok: false,
      message: "Club no encontrado.",
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

  const { data: modules, error: modulesError } = await supabase
    .from("club_modules")
    .select("module, label, sort_order")
    .eq("club_id", club.id)
    .eq("is_allowed", true)
    // .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  if (modulesError) {
    return {
      ok: false,
      message: "No se pudo obtener la navegación pública del club.",
    };
  }

  const enabledModules: PublicClubModule[] = (modules ?? []).map((item) => ({
    module: item.module as PublicClubModuleKey,
    label: item.label,
    href: `/${club.slug}/${item.module}`,
    sort_order: item.sort_order,
  }));

  return {
    ok: true,
    data: {
      club,
      settings: {
        public_name: settings?.public_name ?? club.name,
        primary_color: settings?.primary_color ?? "#111827",
        secondary_color: settings?.secondary_color ?? "#f9fafb",
        accent_color: settings?.accent_color ?? "#22c55e",
        logo_url: settings?.logo_url ?? null,
        cover_image_url: settings?.cover_image_url ?? null,
      },
      enabledModules,
    },
  };
}
