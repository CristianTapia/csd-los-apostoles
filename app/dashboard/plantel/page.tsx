import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardSquadPage() {
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
