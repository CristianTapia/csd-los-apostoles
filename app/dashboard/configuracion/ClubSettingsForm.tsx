"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { updateClubSettingsAction } from "@/server/actions/update-club-settings";
import type { ActionResult } from "@/server/actions/types";

type ClubSettingsFormProps = {
  initialValues: {
    public_name: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    logo_url: string | null;
    cover_image_url: string | null;
  };
};

const initialState: ActionResult = {
  ok: false,
  message: "",
};

export function ClubSettingsForm({ initialValues }: ClubSettingsFormProps) {
  const [state, formAction] = useActionState(updateClubSettingsAction, initialState);

  const fieldErrors = state.ok ? undefined : state.fieldErrors;

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      return;
    }

    toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4">
        <FormField
          label="Nombre del club"
          name="public_name"
          defaultValue={initialValues.public_name}
          error={fieldErrors?.public_name?.[0]}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <ColorField
            label="Color principal"
            name="primary_color"
            defaultValue={initialValues.primary_color}
            error={fieldErrors?.primary_color?.[0]}
          />

          <ColorField
            label="Color secundario"
            name="secondary_color"
            defaultValue={initialValues.secondary_color}
            error={fieldErrors?.secondary_color?.[0]}
          />

          <ColorField
            label="Color acento"
            name="accent_color"
            defaultValue={initialValues.accent_color}
            error={fieldErrors?.accent_color?.[0]}
          />
        </div>

        <FormField
          label="Logo URL"
          name="logo_url"
          type="url"
          defaultValue={initialValues.logo_url ?? ""}
          placeholder="https://..."
          error={fieldErrors?.logo_url?.[0]}
        />

        <FormField
          label="Portada URL"
          name="cover_image_url"
          type="url"
          defaultValue={initialValues.cover_image_url ?? ""}
          placeholder="https://..."
          error={fieldErrors?.cover_image_url?.[0]}
        />
      </div>

      <SubmitButton pendingText="Guardando...">Guardar configuración</SubmitButton>
    </form>
  );
}

function ColorField({
  label,
  name,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  defaultValue: string;
  error?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  const colorPickerValue = isHexColor(value) ? value : "#000000";

  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      <div className="flex gap-2">
        <input
          type="color"
          value={colorPickerValue}
          onChange={(event) => setValue(event.target.value)}
          className="h-11 w-14 cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
          aria-label={`Seleccionar ${label.toLowerCase()}`}
        />

        <input
          name={name}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
          placeholder="#111827"
        />
      </div>

      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function isHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}
