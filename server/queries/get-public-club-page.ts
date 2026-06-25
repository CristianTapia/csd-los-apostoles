import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/server/actions/types";

type PublicClubPage = {
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
    },
  };
}
