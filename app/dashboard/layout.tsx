import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { getAdminAccessContext } from "@/lib/permissions/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const access = await getAdminAccessContext();

  if (!access.configured) {
    return (
      <main className="min-h-dvh bg-background px-4 py-8 text-font-main dark:bg-black dark:text-white">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl items-center">
          <Card className="w-full border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <PageHeader
              title="Dashboard bloqueado"
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

  if (!access.userId) {
    redirect("/auth/login?next=/dashboard");
  }

  if (!access.canAccessDashboard) {
    return (
      <AdminShell variant="dashboard">
        <div className="mx-auto max-w-5xl space-y-5">
          <PageHeader title="Acceso denegado" description="Esta zona es solo para administradores del club." />
          <Card>
            <p className="text-sm text-font-secondary">
              Necesitas rol tenant_owner o tenant_admin. Los roles superadmin sin club y member no pueden acceder a
              /dashboard.
            </p>
          </Card>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell variant="dashboard">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex justify-end">
          <LogoutButton />
        </div>
        {children}
      </div>
    </AdminShell>
  );
}
