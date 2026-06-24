import { CalendarDays, CreditCard, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminAccessContext } from "@/lib/permissions/server";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const access = await getAdminAccessContext();
  const primaryRole =
    access.roles.find((role) => role.role === "superadmin")?.role ??
    access.roles.find((role) => role.role === "tenant_owner" || role.role === "tenant_admin")?.role ??
    "sin rol";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description="Base operativa del club con sesion y roles reales desde Supabase."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Partidos" value="0" helper="Pendiente de conectar" icon={<CalendarDays size={20} />} />
        <StatCard label="Socios" value="0" helper="Pendiente de conectar" icon={<Users size={20} />} />
        <StatCard label="Cuotas" value="0" helper="Sin integracion de pagos aun" icon={<CreditCard size={20} />} />
        <StatCard label="Seguridad" value="RLS" helper="Policies base creadas" icon={<ShieldCheck size={20} />} />
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-font-main dark:text-white">
              {access.activeClub?.name ?? "Sin club activo"}
            </h2>
            <p className="mt-2 text-sm text-font-secondary">
              {access.activeClub
                ? `Tenant activo: ${access.activeClub.slug}`
                : "No hay un club administrativo asociado a esta sesion."}
            </p>
          </div>
          <StatusBadge tone={primaryRole === "sin rol" ? "warning" : "success"}>{primaryRole}</StatusBadge>
        </div>
      </Card>

      <EmptyState
        title="Sin actividad todavia"
        description="El siguiente paso es conectar queries reales y luego construir CRUDs por modulo."
      />
    </div>
  );
}
