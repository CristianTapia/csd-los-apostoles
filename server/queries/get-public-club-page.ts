import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";

export type PublicClubModuleKey =
  | "transparencia"
  | "directiva"
  | "plantel"
  | "socios"
  | "tienda"
  | "actividades"
  | "campeonatos"
  | "calendario"
  | "partidos";

export type PublicClubModule = {
  id: string;
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
  };
  settings: {
    public_name: string;
    logo_url: string | null;
    cover_image_url: string | null;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
  enabledModules: PublicClubModule[];
};

export type PublicClubPageData = PublicClubPage;

const PUBLIC_MODULE_PATHS: Record<PublicClubModuleKey, string> = {
  transparencia: "transparencia",
  directiva: "directiva",
  plantel: "plantel",
  socios: "socios",
  tienda: "tienda",
  actividades: "actividades",
  campeonatos: "campeonatos",
  calendario: "calendario",
  partidos: "partidos",
};

export async function getPublicClubPage(clubSlug: string): Promise<ActionResult<PublicClubPageData>> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      ok: false,
      message: "Supabase no está configurado.",
    };
  }

  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, name, slug")
    .eq("slug", clubSlug)
    .eq("status", "active")
    .maybeSingle();

  if (clubError || !club) {
    return {
      ok: false,
      message: "Club no encontrado.",
    };
  }

  const { data: settings, error: settingsError } = await supabase
    .from("club_settings")
    .select("public_name, logo_url, cover_image_url, primary_color, secondary_color, accent_color")
    .eq("club_id", club.id)
    .maybeSingle();

  if (settingsError || !settings) {
    return {
      ok: false,
      message: "Configuración pública no encontrada.",
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
      message: "No se pudieron cargar los módulos públicos.",
    };
  }

  return {
    ok: true,
    data: {
      club,
      settings,
      enabledModules: (modules ?? []).map((item) => ({
        id: item.id,
        module: item.module as PublicClubModuleKey,
        label: item.label,
        href: `/${club.slug}/${PUBLIC_MODULE_PATHS[item.module as PublicClubModuleKey]}`,
        sort_order: item.sort_order,
      })),
    },
  };
}
