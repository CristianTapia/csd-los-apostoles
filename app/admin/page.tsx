import { CalendarDays, CreditCard, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminHomePage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description="Base operativa del club. Los modulos estan preparados para conectarse a Supabase."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Partidos" value="0" helper="Pendiente de conectar" icon={<CalendarDays size={20} />} />
        <StatCard label="Socios" value="0" helper="Pendiente de conectar" icon={<Users size={20} />} />
        <StatCard label="Cuotas" value="0" helper="Sin integracion de pagos aun" icon={<CreditCard size={20} />} />
        <StatCard label="Seguridad" value="RLS" helper="Policies base creadas" icon={<ShieldCheck size={20} />} />
      </div>

      <Card>
        <h2 className="text-base font-semibold text-font-main dark:text-white">Estado de la base SaaS</h2>
        <p className="mt-2 text-sm text-font-secondary">
          Esta pantalla es un placeholder mobile-first. Los datos sensibles deben cargarse desde Server Components,
          Server Actions o queries server-side con validacion de permisos.
        </p>
      </Card>

      <EmptyState
        title="Sin actividad todavia"
        description="El siguiente paso es conectar queries reales y luego construir CRUDs por modulo."
      />
    </div>
  );
}
