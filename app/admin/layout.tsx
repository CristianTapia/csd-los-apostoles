import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminAccessContext } from "@/lib/permissions/server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const access = await getAdminAccessContext();

  if (access.configured && !access.userId) {
    redirect("/auth/login?next=/admin");
  }

  if (access.configured && access.userId && !access.canAccessAdmin) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-5xl space-y-5">
          <PageHeader title="Acceso denegado" description="Tu usuario no tiene un rol administrativo." />
          <Card>
            <p className="text-sm text-font-secondary">
              Pide a un superadmin que asigne el rol superadmin, tenant_owner o tenant_admin. El rol member no puede
              acceder al dashboard.
            </p>
          </Card>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell showSuperAdminLinks={access.isSuperAdmin}>
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex justify-end">
          {access.userId ? <LogoutButton /> : null}
        </div>
        {!access.configured ? (
          <Card className="flex flex-col gap-2 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <div>
              <StatusBadge tone="warning">Configuracion pendiente</StatusBadge>
            </div>
            <p className="text-sm text-amber-900 dark:text-amber-100">
              Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para activar auth, permisos y datos reales.
            </p>
          </Card>
        ) : null}
        {children}
      </div>
    </AdminShell>
  );
}
