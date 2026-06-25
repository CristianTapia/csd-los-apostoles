import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Configuracion" description="Identidad publica, colores, logo, portada y redes del club." />
      <EmptyState
        title="Configuracion del club pendiente"
        description="Preparado para editar club_settings desde Server Actions validadas con zod."
      />
    </div>
  );
}
