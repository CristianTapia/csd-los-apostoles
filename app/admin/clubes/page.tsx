import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { requireSuperAdmin } from "@/lib/permissions/server";

export const dynamic = "force-dynamic";

export default async function AdminClubsPage() {
  const access = await requireSuperAdmin();

  if (!access.ok && access.reason !== "not_configured") {
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

  return (
    <div className="space-y-5">
      <PageHeader title="Clubes" description="Modulo reservado para superadmin global." />
      <EmptyState
        title="CRUD de clubes pendiente"
        description="Aqui se crearan y administraran tenants cuando se implemente el flujo superadmin."
      />
    </div>
  );
}
