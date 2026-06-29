import Link from "next/link";
import { PublicTeamMark } from "./PublicTeamMark";

type SportsHeroProps = {
  clubSlug: string;
  publicName: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  showSocios: boolean;
  showCalendario: boolean;
};

export function SportsHero({
  clubSlug,
  publicName,
  logoUrl,
  coverImageUrl,
  showSocios,
  showCalendario,
}: SportsHeroProps) {
  return (
    <section className="px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[var(--public-text)] sm:rounded-[2rem]">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={`Portada de ${publicName}`}
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-700" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

          <div className="relative flex min-h-[420px] flex-col justify-end px-4 py-7 text-white sm:min-h-[460px] sm:px-10 sm:py-12 lg:min-h-[560px]">
            <div className="max-w-2xl">
              <div className="mb-5 flex min-w-0 items-center gap-3">
                <PublicTeamMark name={publicName} logoUrl={logoUrl} />

                <p className="min-w-0 truncate text-sm font-semibold uppercase tracking-[0.18em] text-white/75 sm:tracking-[0.22em]">
                  {publicName}
                </p>
              </div>

              <h1 className="max-w-full text-[2.35rem] font-black leading-[0.95] tracking-tight sm:text-6xl">
                Más que un club, una familia
              </h1>

              <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/85 sm:text-lg sm:leading-7">
                Bienvenidos a la casa oficial de nuestra comunidad deportiva. Revisa partidos, resultados, actividades y
                novedades del club.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {showSocios ? (
                  <Link
                    href={`/${clubSlug}/socios`}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--tenant-accent)] px-5 py-3 text-sm font-bold text-[var(--public-text)] transition hover:opacity-90 sm:w-auto"
                  >
                    Hazte socio
                  </Link>
                ) : null}

                {showCalendario ? (
                  <Link
                    href={`/${clubSlug}/calendario`}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white/15 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20 sm:w-auto"
                  >
                    Ver calendario
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
