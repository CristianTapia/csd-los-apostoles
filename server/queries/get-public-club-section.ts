import type { ActionResult } from "@/server/actions/types";
import {
  getPublicClubPage,
  type PublicClubModule,
  type PublicClubModuleKey,
  type PublicClubPage,
} from "@/server/queries/get-public-club-page";

type PublicClubSection = PublicClubPage & {
  activeModule: PublicClubModule;
};

export async function getPublicClubSection(
  clubSlug: string,
  module: PublicClubModuleKey,
): Promise<ActionResult<PublicClubSection>> {
  const result = await getPublicClubPage(clubSlug);

  if (!result.ok || !result.data) {
    return {
      ok: false,
      message: result.message ?? "No se pudo cargar la página del club.",
    };
  }

  const activeModule = result.data.enabledModules.find((item) => item.module === module);

  if (!activeModule) {
    return {
      ok: false,
      message: "Este módulo no está disponible para este club.",
    };
  }

  return {
    ok: true,
    data: {
      ...result.data,
      activeModule,
    },
  };
}
