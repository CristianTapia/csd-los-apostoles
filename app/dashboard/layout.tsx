import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { PrivateShell } from "@/components/layouts/PrivateShell";
import { Card } from "@/components/ui/Card";
import { getActiveDashboardContext } from "@/server/queries/get-active-dashboard-context";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const context = await getActiveDashboardContext();

  if (!context.ok && context.reason === "not_configured") {
    return (
      <main className="min-h-dvh bg-background px-4 py-8 text-font-main dark:bg-black dark:text-white">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl items-center">
          <Card className="w-full border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <PageHeader
              title="Dashboard bloqueado"
              description="Supabase no está configurado. El dashboard no puede renderizarse sin autenticación y permisos."
            />

            <p className="mt-4 text-sm text-red-900 dark:text-red-100">
              Crea un archivo .env.local en la raíz del proyecto con NEXT_PUBLIC_SUPABASE_URL y
              NEXT_PUBLIC_SUPABASE_ANON_KEY. Luego reinicia el servidor de desarrollo.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  if (!context.ok && context.reason === "unauthenticated") {
    redirect("/auth/login?next=/dashboard");
  }

  if (!context.ok) {
    return (
      <PrivateShell nav={<DashboardNav modules={[]} />}>
        <div className="mx-auto max-w-5xl space-y-5">
          <PageHeader title="Acceso denegado" description="Esta zona es solo para administradores del club." />

          <Card>
            <p className="text-sm text-font-secondary">
              Necesitas rol tenant_owner o tenant_admin. Los roles superadmin sin club y member no pueden acceder a
              /dashboard.
            </p>
          </Card>
        </div>
      </PrivateShell>
    );
  }

  return (
    <PrivateShell nav={<DashboardNav modules={context.data.modules} />}>
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex justify-end">
          <LogoutButton />
        </div>

        {children}
      </div>
    </PrivateShell>
  );
}
