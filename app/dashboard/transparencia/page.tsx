import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardTransparencyPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Transparencia" description="Espacio futuro para documentos, reportes y comunicados publicos." />
      <EmptyState
        title="Modulo pendiente"
        description="No se implementan uploads ni documentos en esta etapa; solo queda reservada la ruta."
      />
    </div>
  );
}
