import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getActiveClubSettings } from "@/server/queries/get-active-club-settings";
import { ClubSettingsForm } from "./ClubSettingsForm";

export default async function DashboardConfiguracionPage() {
  const result = await getActiveClubSettings();

  if (!result.ok || !result.data) {
    return (
      <section className="space-y-4">
        <PageHeader title="Configuración" description="Configuración pública del club." />

        <Card className="border-red-200 bg-red-50 text-sm text-red-700">
          {result.message ?? "No se pudo cargar la configuración del club."}
        </Card>
      </section>
    );
  }

  const { club, settings, role } = result.data;

  return (
    <section className="space-y-6">
      <PageHeader title="Configuración" description="Edita la identidad pública, colores e imágenes base del club." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-gray-950">Identidad del club</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <InfoItem label="Nombre del club" value={settings.public_name} />
            <InfoItem label="Página pública" value={`/${club.slug}`} />
            <InfoItem label="Estado" value={club.status} />
            <InfoItem label="Tu rol" value={role} />
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-950">Imágenes públicas</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <InfoItem label="Logo" value={settings.logo_url || "Sin logo configurado"} breakAll />

            <InfoItem label="Portada" value={settings.cover_image_url || "Sin portada configurada"} breakAll />
          </dl>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-950">Colores del club</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <ColorPreview label="Principal" value={settings.primary_color} />
          <ColorPreview label="Secundario" value={settings.secondary_color} />
          <ColorPreview label="Acento" value={settings.accent_color} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-950">Editar identidad del club</h2>

        <p className="mt-1 text-sm text-gray-500">Estos datos se usarán para la página pública del club.</p>

        <div className="mt-5">
          <ClubSettingsForm initialValues={settings} />
        </div>
      </Card>
    </section>
  );
}

function InfoItem({ label, value, breakAll = false }: { label: string; value: string; breakAll?: boolean }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className={["font-medium text-gray-900", breakAll ? "break-all" : ""].join(" ")}>{value}</dd>
    </div>
  );
}

function ColorPreview({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <div className="h-16 rounded-lg border border-gray-200" style={{ backgroundColor: value }} />

      <p className="mt-2 text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{value}</p>
    </div>
  );
}
