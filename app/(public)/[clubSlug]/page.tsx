import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getPublicClubPage } from "@/server/queries/get-public-club-page";
import Link from "next/link";
import { PublicClubNav } from "@/components/public/PublicClubNav";

type ClubPublicPageProps = {
  params: Promise<{
    clubSlug: string;
  }>;
};

type TenantThemeStyle = CSSProperties & {
  "--tenant-primary": string;
  "--tenant-secondary": string;
  "--tenant-accent": string;
};

export default async function ClubPublicPage({ params }: ClubPublicPageProps) {
  const { clubSlug } = await params;

  const result = await getPublicClubPage(clubSlug);

  if (!result.ok || !result.data) {
    notFound();
  }

  const { club, settings, enabledModules } = result.data;

  const themeStyle: TenantThemeStyle = {
    "--tenant-primary": settings.primary_color,
    "--tenant-secondary": settings.secondary_color,
    "--tenant-accent": settings.accent_color,
  };

  return (
    <main style={themeStyle} className="min-h-screen bg-[var(--tenant-secondary)] text-gray-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20" />

        {settings.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.cover_image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[var(--tenant-primary)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20" />

        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col justify-between px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {settings.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={settings.logo_url}
                  alt={`Logo de ${settings.public_name}`}
                  className="h-12 w-12 rounded-2xl border border-white/20 bg-white object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-lg font-bold text-white">
                  {settings.public_name.charAt(0)}
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-white/70">Club deportivo</p>
                <p className="font-semibold text-white">{settings.public_name}</p>
              </div>
            </div>
            <PublicClubNav clubSlug={club.slug} modules={enabledModules} />
            <Link
              href="/auth/login"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ingresar
            </Link>
          </header>

          <div className="max-w-3xl py-16">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/20">
              Página oficial
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{settings.public_name}</h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Información del club, partidos, resultados, socios y transparencia en un solo lugar.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {enabledModules.some((item) => item.module === "transparencia") ? (
                <Link
                  href={`/${club.slug}/transparencia`}
                  className="rounded-full bg-[var(--tenant-accent)] px-5 py-3 text-center text-sm font-semibold text-gray-950 transition hover:opacity-90"
                >
                  Ver transparencia
                </Link>
              ) : null}

              {enabledModules.some((item) => item.module === "calendario") ? (
                <Link
                  href={`/${club.slug}/calendario`}
                  className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Ver calendario
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-10">
        {enabledModules.slice(0, 6).map((item) => (
          <PublicCard
            key={item.module}
            href={item.href}
            title={item.label}
            description={getModuleDescription(item.module)}
          />
        ))}
      </section>
    </main>
  );
}

function PublicCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-gray-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </Link>
  );
}

function getModuleDescription(module: string) {
  const descriptions: Record<string, string> = {
    transparencia: "Información pública, cuotas, ingresos y gastos del club.",
    plantel: "Jugadores, cuerpo técnico y categorías del club.",
    socios: "Información para socios, comunidad y beneficios.",
    tienda: "Productos, camisetas, merchandising y aportes.",
    actividades: "Rifas, campañas, platos únicos y eventos comunitarios.",
    campeonatos: "Torneos, inscripciones, fixtures y bases.",
    calendario: "Próximos partidos, resultados y actividades programadas.",
  };

  return descriptions[module] ?? "Información pública del club.";
}
