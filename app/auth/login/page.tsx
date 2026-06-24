import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-font-main dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md items-center">
        <Card className="w-full">
          <h1 className="text-2xl font-bold">Iniciar sesion</h1>
          <p className="mt-2 text-sm text-font-secondary">
            Pantalla reservada para el flujo de autenticacion con Supabase. No se implementa login completo en esta etapa.
          </p>
        </Card>
      </div>
    </main>
  );
}
