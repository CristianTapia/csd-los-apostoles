import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/app/auth/login/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/admin";

  return (
    <main className="min-h-dvh bg-background px-4 py-8 text-font-main dark:bg-black dark:text-white">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-md items-center">
        <Card className="w-full">
          <h1 className="text-2xl font-bold">Iniciar sesion</h1>
          <p className="mt-2 text-sm text-font-secondary">
            Accede con el email y password configurados en Supabase Auth.
          </p>
          <LoginForm nextPath={nextPath} />
        </Card>
      </div>
    </main>
  );
}
