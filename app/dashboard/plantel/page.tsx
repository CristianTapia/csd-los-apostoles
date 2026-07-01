import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireDashboardModule } from "@/server/queries/get-active-dashboard-context";

export default async function DashboardSquadPage() {
  const moduleAccess = await requireDashboardModule("plantel");

  if (!moduleAccess.ok) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Plantel" description="Jugadores, equipos y categorias del club." />
      <EmptyState
        title="Gestion de plantel pendiente"
        description="Preparado para conectar equipos y jugadores sin construir CRUD todavia."
      />
    </div>
  );
}
