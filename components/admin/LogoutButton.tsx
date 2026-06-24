import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/auth/login/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-black/10 px-3 text-sm font-medium text-font-main hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
      >
        <LogOut size={16} />
        Salir
      </button>
    </form>
  );
}
