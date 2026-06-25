import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardMatchesPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Partidos" description="Proximos encuentros, resultados y estados por equipo." />
      <EmptyState
        title="Gestion de partidos pendiente"
        description="Los listados futuros deberian usar cards en mobile y tabla solo desde desktop."
      />
    </div>
  );
}
