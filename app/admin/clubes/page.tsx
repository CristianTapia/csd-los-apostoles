import Link from "next/link";
import { AdminClubForm } from "./AdminClubForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireSuperAdmin } from "@/lib/permissions/server";
import { getAdminClubs, type AdminClubListItem } from "@/server/queries/get-admin-clubs";

export const dynamic = "force-dynamic";

export default async function AdminClubsPage() {
  const access = await requireSuperAdmin();

  if (!access.ok) {
    return (
      <div className="space-y-5">
        <PageHeader title="Clubes" description="Gestion global de tenants." />
        <Card>
          <StatusBadge tone="danger">Acceso denegado</StatusBadge>
          <p className="mt-3 text-sm text-font-secondary">{access.message}</p>
        </Card>
      </div>
    );
  }

  const result = await getAdminClubs();

  if (!result.ok || !result.data) {
    return (
      <div className="space-y-5">
        <PageHeader title="Clubes" description="Gestion global de tenants." />

        <Card>
          <StatusBadge tone="danger">Error</StatusBadge>
          <p className="mt-3 text-sm text-font-secondary">{result.message ?? "No se pudieron cargar los clubes."}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Clubes" description="Crea tenants, configura su base inicial y asigna un owner." />

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-font-main">Crear club</h2>
          <p className="mt-1 text-sm text-font-secondary">
            El owner debe existir como usuario/profile antes de asignarlo al tenant.
          </p>
        </div>

        <AdminClubForm />
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-font-main">Tenants existentes</h2>
          <p className="mt-1 text-sm text-font-secondary">Clubes creados y owner principal asociado.</p>
        </div>

        {result.data.clubs.length === 0 ? (
          <EmptyState title="Todavia no hay clubes" description="Crea el primer tenant para comenzar." />
        ) : (
          <div className="space-y-3">
            {result.data.clubs.map((club) => (
              <AdminClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AdminClubCard({ club }: { club: AdminClubListItem }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-font-main">{club.name}</h3>
            <StatusBadge tone={club.status === "active" ? "success" : "warning"}>{club.status}</StatusBadge>
          </div>

          <dl className="mt-3 grid gap-2 text-sm text-font-secondary sm:grid-cols-2">
            <InfoItem label="Slug" value={`/${club.slug}`} />
            <InfoItem label="Nombre publico" value={club.public_name ?? "Sin settings"} />
            <InfoItem label="Owner" value={formatOwner(club.owner)} />
            <InfoItem label="Creado" value={formatDate(club.created_at)} />
          </dl>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${club.slug}`}
            className="inline-flex min-h-10 items-center rounded-xl border border-black/10 px-3 text-sm font-medium text-font-main transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
          >
            Ver publico
          </Link>

          <Link
            href="/admin/modulos"
            className="inline-flex min-h-10 items-center rounded-xl bg-font-main px-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
          >
            Modulos
          </Link>
        </div>
      </div>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-font-secondary">{label}</dt>
      <dd className="mt-1 break-words text-font-main">{value}</dd>
    </div>
  );
}

function formatOwner(owner: AdminClubListItem["owner"]) {
  if (!owner) return "Sin owner";

  return owner.full_name ? `${owner.full_name} (${owner.email})` : owner.email;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
  }).format(new Date(value));
}
