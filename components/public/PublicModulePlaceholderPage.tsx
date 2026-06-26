import type { CSSProperties } from "react";
import Link from "next/link";
import type { PublicClubModule } from "@/server/queries/get-public-club-page";

type TenantThemeStyle = CSSProperties & {
  "--tenant-primary": string;
  "--tenant-secondary": string;
  "--tenant-accent": string;
};

type PublicModulePlaceholderPageProps = {
  clubSlug: string;
  publicName: string;
  module: PublicClubModule;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

export function PublicModulePlaceholderPage({
  clubSlug,
  publicName,
  module,
  description,
  colors,
}: PublicModulePlaceholderPageProps) {
  const themeStyle: TenantThemeStyle = {
    "--tenant-primary": colors.primary,
    "--tenant-secondary": colors.secondary,
    "--tenant-accent": colors.accent,
  };

  return (
    <main style={themeStyle} className="min-h-screen bg-[var(--tenant-secondary)] text-gray-950">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
        <Link href={`/${clubSlug}`} className="text-sm font-medium text-gray-500 transition hover:text-gray-900">
          ← Volver al inicio
        </Link>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-[var(--tenant-primary)]">{publicName}</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">{module.label}</h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">{description}</p>

          <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5">
            <p className="text-sm font-medium text-gray-900">Módulo en preparación</p>
            <p className="mt-1 text-sm text-gray-500">
              Esta sección está activa para el club, pero su contenido todavía no ha sido configurado.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
