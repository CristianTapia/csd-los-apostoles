"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, TextInput } from "@/components/ui/form/FormField";
import { FormSubmitButton } from "@/components/ui/form/FormSubmitButton";
import { createAdminClubAction, type CreatedAdminClub } from "@/server/actions/create-admin-club";
import type { ActionResult } from "@/server/actions/types";

const initialState: ActionResult<CreatedAdminClub> = {
  ok: false,
  message: "",
};

export function AdminClubForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createAdminClubAction, initialState);

  const fieldErrors = state.ok ? undefined : state.fieldErrors;

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
      router.refresh();
      return;
    }

    toast.error(state.message);
  }, [state, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="name" label="Nombre del club" error={fieldErrors?.name?.[0]}>
          <TextInput id="name" name="name" type="text" placeholder="Ej: Club Deportivo Norte" />
        </FormField>

        <FormField
          htmlFor="slug"
          label="Slug publico"
          hint="Usa minusculas, numeros y guiones."
          error={fieldErrors?.slug?.[0]}
        >
          <TextInput id="slug" name="slug" type="text" placeholder="club-deportivo-norte" />
        </FormField>
      </div>

      <FormField
        htmlFor="owner_email"
        label="Email del tenant owner"
        hint="Debe existir como profile en Supabase Auth."
        error={fieldErrors?.owner_email?.[0]}
      >
        <TextInput id="owner_email" name="owner_email" type="email" placeholder="owner@club.cl" />
      </FormField>

      <FormSubmitButton pendingText="Creando club...">Crear club</FormSubmitButton>
    </form>
  );
}
