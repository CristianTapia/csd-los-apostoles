import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { getAdminAccessContext } from "@/lib/permissions/server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const access = await getAdminAccessContext();

  if (!access.configured) {
    return (
      <main className="min-h-dvh bg-background px-4 py-8 text-font-main dark:bg-black dark:text-white">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl items-center">
          <Card className="w-full border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <PageHeader
              title="Admin bloqueado"
              description="Supabase no esta configurado. El dashboard no puede renderizarse sin autenticacion y permisos."
            />
            <p className="mt-4 text-sm text-red-900 dark:text-red-100">
              Crea un archivo .env.local en la raiz del proyecto con NEXT_PUBLIC_SUPABASE_URL y
              NEXT_PUBLIC_SUPABASE_ANON_KEY. Luego reinicia el servidor de desarrollo.
            </p>
          </Card>
        </div>
      </main>
    );
  }

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
        {children}
      </div>
    </AdminShell>
  );
}
