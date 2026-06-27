"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateMatchKitColorsAction } from "@/server/actions/update-match-kit-colors";
import type { DashboardMatchEvent } from "@/server/queries/get-dashboard-match-events";

type MatchKitColorFormProps = {
  match: DashboardMatchEvent;
};

const KIT_COLORS = [
  { label: "Sin color", value: "" },
  { label: "Rojo", value: "#dc2626" },
  { label: "Azul", value: "#2563eb" },
  { label: "Verde", value: "#16a34a" },
  { label: "Amarillo", value: "#facc15" },
  { label: "Blanco", value: "#ffffff" },
  { label: "Negro", value: "#111827" },
  { label: "Naranjo", value: "#f97316" },
  { label: "Morado", value: "#9333ea" },
];

export function MatchKitColorForm({ match }: MatchKitColorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function updateColors(input: { club_kit_color?: string; opponent_kit_color?: string }) {
    startTransition(async () => {
      const result = await updateMatchKitColorsAction({
        event_id: match.id,
        club_kit_color: input.club_kit_color ?? match.club_kit_color ?? "",
        opponent_kit_color: input.opponent_kit_color ?? match.opponent_kit_color ?? "",
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message ?? "Colores actualizados.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div>
        <p className="text-sm font-semibold text-font-main">Colores de camiseta</p>

        <p className="mt-1 text-xs text-font-secondary">Se guardan automáticamente al seleccionar.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ColorSelect
          id={`club-kit-${match.id}`}
          label="Camiseta club"
          defaultValue={match.club_kit_color ?? ""}
          disabled={isPending}
          onChange={(value) => updateColors({ club_kit_color: value })}
        />

        <ColorSelect
          id={`opponent-kit-${match.id}`}
          label="Camiseta rival"
          defaultValue={match.opponent_kit_color ?? ""}
          disabled={isPending}
          onChange={(value) => updateColors({ opponent_kit_color: value })}
        />
      </div>
    </div>
  );
}

function ColorSelect({
  id,
  label,
  defaultValue,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  defaultValue: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-font-main">
        {label}
      </label>

      <select
        id={id}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black disabled:opacity-60 dark:border-white/10 dark:bg-neutral-950 dark:text-white"
      >
        {KIT_COLORS.map((color) => (
          <option key={color.label} value={color.value}>
            {color.label}
          </option>
        ))}
      </select>
    </div>
  );
}
