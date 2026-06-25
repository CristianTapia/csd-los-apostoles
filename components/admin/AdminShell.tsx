import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

type AdminShellProps = {
  children: ReactNode;
  variant?: "admin" | "dashboard";
};

export function AdminShell({ children, variant = "dashboard" }: AdminShellProps) {
  return (
    <div className="min-h-dvh bg-background text-font-main dark:bg-black">
      <div className="lg:flex">
        <AdminNav variant={variant} />
        <main className="w-full min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
