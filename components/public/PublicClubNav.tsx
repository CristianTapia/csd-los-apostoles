import Link from "next/link";
import type { PublicClubModule } from "@/server/queries/get-public-club-page";

type PublicClubNavProps = {
  clubSlug: string;
  modules: PublicClubModule[];
};

export function PublicClubNav({ clubSlug, modules }: PublicClubNavProps) {
  return (
    <nav className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur md:flex">
      <Link
        href={`/${clubSlug}`}
        className="rounded-full px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        Inicio
      </Link>

      {modules.map((item) => (
        <Link
          key={item.module}
          href={item.href}
          className="rounded-full px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
