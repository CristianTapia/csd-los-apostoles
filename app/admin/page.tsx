import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminAccessContext } from "@/lib/permissions/server";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const access = await getAdminAccessContext();

  return (
    <div className="space-y-5">
      <PageHeader title="Superadmin" description="Gestion global del SaaS y tenants." />

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-font-main dark:text-white">Acceso global</h2>
            <p className="mt-2 text-sm text-font-secondary">Usuario autenticado con permisos de superadmin.</p>
          </div>
          <StatusBadge tone={access.isSuperAdmin ? "success" : "warning"}>superadmin</StatusBadge>
        </div>
      </Card>

      <EmptyState
        title="Sin actividad todavia"
        description="El siguiente paso es conectar queries reales y luego construir CRUDs por modulo."
      />
    </div>
  );
}
