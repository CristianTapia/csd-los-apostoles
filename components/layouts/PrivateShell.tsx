import type { ReactNode } from "react";

type PrivateShellProps = {
  nav: ReactNode;
  children: ReactNode;
};

export function PrivateShell({ nav, children }: PrivateShellProps) {
  return (
    <div className="min-h-dvh bg-background text-font-main dark:bg-black dark:text-white lg:flex">
      {nav}

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
