import { getActiveClubSettings } from "@/server/queries/get-active-club-settings";
import { ClubSettingsForm } from "./ClubSettingsForm";

export default async function DashboardConfiguracionPage() {
  const result = await getActiveClubSettings();

  if (!result.ok || !result.data) {
    return (
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
          <p className="mt-1 text-sm text-gray-500">Configuración pública del club.</p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.message}</div>
      </section>
    );
  }

  const { club, settings, role } = result.data;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">Identidad pública y apariencia base del club.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Club activo</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Nombre interno</dt>
              <dd className="font-medium text-gray-900">{club.name}</dd>
            </div>

            <div>
              <dt className="text-gray-500">Slug público</dt>
              <dd className="font-medium text-gray-900">/{club.slug}</dd>
            </div>

            <div>
              <dt className="text-gray-500">Estado</dt>
              <dd className="font-medium text-gray-900">{club.status}</dd>
            </div>

            <div>
              <dt className="text-gray-500">Tu rol</dt>
              <dd className="font-medium text-gray-900">{role}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Configuración pública</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Nombre público</dt>
              <dd className="font-medium text-gray-900">{settings.public_name}</dd>
            </div>

            <div>
              <dt className="text-gray-500">Logo URL</dt>
              <dd className="break-all font-medium text-gray-900">{settings.logo_url || "Sin logo configurado"}</dd>
            </div>

            <div>
              <dt className="text-gray-500">Portada URL</dt>
              <dd className="break-all font-medium text-gray-900">
                {settings.cover_image_url || "Sin portada configurada"}
              </dd>
            </div>
          </dl>
        </article>
      </div>

      <article className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Colores del club</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <ColorPreview label="Principal" value={settings.primary_color} />
          <ColorPreview label="Secundario" value={settings.secondary_color} />
          <ColorPreview label="Acento" value={settings.accent_color} />
        </div>
      </article>

      <article className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Editar configuración</h2>
        <p className="mt-1 text-sm text-gray-500">Estos datos se usarán para la página pública del club.</p>

        <div className="mt-5">
          <ClubSettingsForm initialValues={settings} />
        </div>
      </article>
    </section>
  );
}

function ColorPreview({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="h-16 rounded-lg border" style={{ backgroundColor: value }} />
      <p className="mt-2 text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{value}</p>
    </div>
  );
}
