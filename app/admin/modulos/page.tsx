import { AdminClubModulesForm } from "./AdminClubModulesForm";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminClubModules } from "@/server/queries/get-admin-club-modules";

export default async function AdminModulosPage() {
  const result = await getAdminClubModules();

  if (!result.ok || !result.data) {
    return (
      <section className="space-y-4">
        <PageHeader title="Módulos" description="Administra qué módulos tiene habilitado cada club." />

        <Card className="border-red-200 bg-red-50 text-sm text-red-700">
          {result.message ?? "No se pudieron cargar los módulos."}
        </Card>
      </section>
    );
  }

  const { clubs } = result.data;

  return (
    <section className="space-y-6">
      <PageHeader title="Módulos" description="Activa o desactiva capacidades disponibles para cada club." />

      {clubs.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500">Todavía no hay clubes creados.</p>
        </Card>
      ) : (
        <div className="space-y-5">
          {clubs.map((club) => (
            <Card key={club.id}>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-950">{club.name}</h2>

                <p className="mt-1 text-sm text-gray-500">
                  /{club.slug} · Estado: {club.status}
                </p>
              </div>

              <AdminClubModulesForm club={club} />
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
