import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { PrivateShell } from "@/components/layouts/PrivateShell";
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
              description="Supabase no está configurado. El panel admin no puede renderizarse sin autenticación y permisos."
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

  if (!access.userId) {
    redirect("/auth/login?next=/admin");
  }

  if (!access.canAccessAdmin) {
    return (
      <PrivateShell nav={<AdminNav />}>
        <div className="mx-auto max-w-5xl space-y-5">
          <PageHeader title="Acceso denegado" description="Esta zona es solo para superadmin." />

          <Card>
            <p className="text-sm text-font-secondary">
              Los roles tenant_owner, tenant_admin y member no pueden acceder a /admin.
            </p>
          </Card>
        </div>
      </PrivateShell>
    );
  }

  return (
    <PrivateShell nav={<AdminNav />}>
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex justify-end">
          <LogoutButton />
        </div>

        {children}
      </div>
    </PrivateShell>
  );
}
