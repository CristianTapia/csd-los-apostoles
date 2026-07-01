import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireDashboardModule } from "@/server/queries/get-active-dashboard-context";

export default async function DashboardMembersPage() {
  const moduleAccess = await requireDashboardModule("socios");

  if (!moduleAccess.ok) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Socios" description="Base para miembros, estados y cuotas mensuales." />
      <EmptyState
        title="Gestion de socios pendiente"
        description="Antes del CRUD conviene definir relacion segura entre profiles y members para autoservicio."
      />
    </div>
  );
}
