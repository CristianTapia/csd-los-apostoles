"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { updateAdminClubModulesAction } from "@/server/actions/update-admin-club-modules";
import type { ActionResult } from "@/server/actions/types";
import type { AdminClubWithModules } from "@/server/queries/get-admin-club-modules";

type AdminClubModulesFormProps = {
  club: AdminClubWithModules;
};

const initialState: ActionResult = {
  ok: false,
  message: "",
};

export function AdminClubModulesForm({ club }: AdminClubModulesFormProps) {
  const [state, formAction] = useActionState(updateAdminClubModulesAction, initialState);

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      return;
    }

    toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="club_id" value={club.id} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {club.modules.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300"
          >
            <input
              type="checkbox"
              name="allowed_modules"
              value={item.id}
              defaultChecked={item.is_allowed}
              className="mt-1 h-5 w-5 rounded border-gray-300"
            />

            <div>
              <p className="text-sm font-semibold text-gray-950">{item.label}</p>
              <p className="mt-1 text-xs text-gray-500">{getModuleDescription(item.module)}</p>
            </div>
          </label>
        ))}
      </div>

      <SubmitButton pendingText="Guardando módulos...">Guardar módulos de {club.name}</SubmitButton>
    </form>
  );
}

function getModuleDescription(module: string) {
  const descriptions: Record<string, string> = {
    transparencia: "Información pública, cuotas, ingresos y gastos del club.",
    plantel: "Jugadores, cuerpo técnico y categorías.",
    socios: "Información para socios y comunidad.",
    tienda: "Productos, camisetas y merchandising.",
    actividades: "Rifas, campañas y eventos comunitarios.",
    campeonatos: "Torneos, inscripciones y fixtures.",
    calendario: "Partidos, resultados y actividades programadas.",
    partidos: "Fixture, resultados, historial y rendimiento deportivo del club.",
  };

  return descriptions[module] ?? "Módulo público del club.";
}
