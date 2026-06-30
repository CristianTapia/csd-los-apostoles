"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClubEventAction } from "@/server/actions/create-club-event";
import type { ActionResult } from "@/server/actions/types";
import { NON_MATCH_CLUB_EVENT_TYPES, NON_MATCH_CLUB_EVENT_TYPE_LABELS } from "@/server/schemas/club-event";
import { DateTimeField } from "@/components/ui/form/DateTimeField";
import { FormField, InfoBox, SelectInput, TextArea, TextInput } from "@/components/ui/form/FormField";
import { FormSubmitButton } from "@/components/ui/form/FormSubmitButton";

const initialState: ActionResult = {
  ok: false,
  message: "",
};

export function ClubEventForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [startsAt, setStartsAt] = useState({
    date: "",
    time: "",
  });

  const [endsAt, setEndsAt] = useState({
    date: "",
    time: "",
  });

  const [state, formAction] = useActionState(createClubEventAction, initialState);

  const fieldErrors = state.ok ? undefined : state.fieldErrors;

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
      setStartsAt({ date: "", time: "" });
      setEndsAt({ date: "", time: "" });
      router.refresh();
      return;
    }

    toast.error(state.message);
  }, [state, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="title" label="Título" error={fieldErrors?.title?.[0]}>
          <TextInput id="title" name="title" type="text" placeholder="Ej: Rifa solidaria" />
        </FormField>

        <FormField htmlFor="event_type" label="Tipo de evento" error={fieldErrors?.event_type?.[0]}>
          <SelectInput id="event_type" name="event_type" defaultValue="community">
            {NON_MATCH_CLUB_EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {NON_MATCH_CLUB_EVENT_TYPE_LABELS[type]}
              </option>
            ))}
          </SelectInput>
        </FormField>
      </div>

      <DateTimeField
        idPrefix="event-starts-at"
        name="starts_at"
        value={startsAt}
        onChange={setStartsAt}
        dateLabel="Fecha de inicio"
        timeLabel="Hora de inicio"
        error={fieldErrors?.starts_at?.[0]}
      />

      <DateTimeField
        idPrefix="event-ends-at"
        name="ends_at"
        value={endsAt}
        onChange={setEndsAt}
        dateLabel="Fecha de término opcional"
        timeLabel="Hora de término opcional"
        error={fieldErrors?.ends_at?.[0]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="location" label="Lugar opcional" error={fieldErrors?.location?.[0]}>
          <TextInput id="location" name="location" type="text" placeholder="Ej: Sede del club" />
        </FormField>

        <FormField htmlFor="location_url" label="Link de ubicación opcional" error={fieldErrors?.location_url?.[0]}>
          <TextInput id="location_url" name="location_url" type="url" placeholder="https://maps.google.com/..." />
        </FormField>
      </div>

      <FormField htmlFor="description" label="Descripción opcional" error={fieldErrors?.description?.[0]}>
        <TextArea id="description" name="description" rows={4} placeholder="Agrega detalles del evento..." />
      </FormField>

      <InfoBox>Este evento se publicará automáticamente en el calendario público del club.</InfoBox>

      <FormSubmitButton pendingText="Creando...">Crear evento</FormSubmitButton>
    </form>
  );
}
