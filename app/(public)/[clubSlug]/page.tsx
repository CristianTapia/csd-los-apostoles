import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getPublicClubPage } from "@/server/queries/get-public-club-page";

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

  const { club, settings } = result.data;

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

            <a
              href="/auth/login"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ingresar
            </a>
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
              <a
                href={`/${club.slug}/transparencia`}
                className="rounded-full bg-[var(--tenant-accent)] px-5 py-3 text-center text-sm font-semibold text-gray-950 transition hover:opacity-90"
              >
                Ver transparencia
              </a>

              <a
                href={`/${club.slug}/partidos`}
                className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Próximos partidos
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-10">
        <PublicCard title="Partidos" description="Calendario y resultados del club." />
        <PublicCard title="Plantel" description="Jugadores, cuerpo técnico y categorías." />
        <PublicCard title="Socios" description="Información para socios y comunidad." />
      </section>
    </main>
  );
}

function PublicCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </article>
  );
}
