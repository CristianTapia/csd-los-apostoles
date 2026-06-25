"use client";

import { useActionState } from "react";
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
  const [state, formAction, isPending] = useActionState(updateClubSettingsAction, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.message ? (
        <div
          className={[
            "rounded-xl border p-4 text-sm",
            state.ok ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700",
          ].join(" ")}
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4">
        <FormField
          label="Nombre público"
          name="public_name"
          defaultValue={initialValues.public_name}
          error={state.fieldErrors?.public_name?.[0]}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <ColorField
            label="Color principal"
            name="primary_color"
            defaultValue={initialValues.primary_color}
            error={state.fieldErrors?.primary_color?.[0]}
          />

          <ColorField
            label="Color secundario"
            name="secondary_color"
            defaultValue={initialValues.secondary_color}
            error={state.fieldErrors?.secondary_color?.[0]}
          />

          <ColorField
            label="Color acento"
            name="accent_color"
            defaultValue={initialValues.accent_color}
            error={state.fieldErrors?.accent_color?.[0]}
          />
        </div>

        <FormField
          label="Logo URL"
          name="logo_url"
          type="url"
          defaultValue={initialValues.logo_url ?? ""}
          placeholder="https://..."
          error={state.fieldErrors?.logo_url?.[0]}
        />

        <FormField
          label="Portada URL"
          name="cover_image_url"
          type="url"
          defaultValue={initialValues.cover_image_url ?? ""}
          placeholder="https://..."
          error={state.fieldErrors?.cover_image_url?.[0]}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Guardando..." : "Guardar configuración"}
      </button>
    </form>
  );
}

function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
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
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      <div className="flex gap-2">
        <input
          type="color"
          value={defaultValue}
          readOnly
          tabIndex={-1}
          className="h-11 w-14 rounded-xl border border-gray-200 bg-white p-1"
        />

        <input
          name={name}
          type="text"
          defaultValue={defaultValue}
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
        />
      </div>

      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
