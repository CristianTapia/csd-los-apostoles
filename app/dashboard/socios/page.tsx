import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardMembersPage() {
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
