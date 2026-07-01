"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, CalendarDays, FileText, Home, Menu, Settings, Trophy, Users, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { PublicClubModuleKey } from "@/server/queries/get-public-club-page";

const dashboardItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
  { href: "/dashboard/calendario", label: "Calendario", icon: CalendarDays, module: "calendario" },
  { href: "/dashboard/partidos", label: "Partidos", icon: Trophy, module: "partidos" },
  { href: "/dashboard/eventos", label: "Eventos", icon: CalendarDays, module: "actividades" },
  { href: "/dashboard/socios", label: "Socios", icon: Users, module: "socios" },
  { href: "/dashboard/transparencia", label: "Transparencia", icon: FileText, module: "transparencia" },
  { href: "/dashboard/plantel", label: "Plantel", icon: Building2, module: "plantel" },
];

type DashboardNavProps = {
  modules: { module: PublicClubModuleKey }[];
};

export function DashboardNav({ modules }: DashboardNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const allowedModules = new Set<PublicClubModuleKey>(modules.map((item) => item.module));
  const visibleItems = dashboardItems.filter((item) => !item.module || allowedModules.has(item.module as PublicClubModuleKey));

  return (
    <div className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-neutral-950 lg:min-h-dvh lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between px-4 lg:h-auto lg:flex-col lg:items-start lg:gap-6 lg:px-5 lg:py-6">
        <Link href="/dashboard" className="font-bold text-font-main dark:text-white">
          Dashboard
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-font-main dark:border-white/10 dark:text-white lg:hidden"
          aria-expanded={open}
          aria-controls="dashboard-mobile-nav"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav
        id="dashboard-mobile-nav"
        className={cn(
          "grid gap-1 overflow-hidden px-4 transition-[max-height] duration-200 lg:max-h-none lg:px-3 lg:pb-4",
          open ? "max-h-96 pb-4" : "max-h-0 lg:pb-4",
        )}
      >
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                active
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-font-secondary hover:bg-black/5 hover:text-font-main dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
