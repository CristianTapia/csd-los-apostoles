"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createMatchEventAction } from "@/server/actions/create-match-event";
import type { ActionResult } from "@/server/actions/types";
import { CLUB_MATCH_SIDE_LABELS, CLUB_MATCH_SIDES, type ClubMatchSide } from "@/server/schemas/calendar-event";
import { DateTimeField } from "@/components/ui/form/DateTimeField";
import { FormField, InfoBox, SelectInput, TextInput } from "@/components/ui/form/FormField";
import { FormSubmitButton } from "@/components/ui/form/FormSubmitButton";

type MatchEventFormProps = {
  clubName: string;
};

const initialState: ActionResult = {
  ok: false,
  message: "",
};

export function MatchEventForm({ clubName }: MatchEventFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [startsAt, setStartsAt] = useState({
    date: "",
    time: "",
  });

  const [clubSide, setClubSide] = useState<ClubMatchSide>("home");

  const [state, formAction] = useActionState(createMatchEventAction, initialState);

  const fieldErrors = state.ok ? undefined : state.fieldErrors;

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      formRef.current?.reset();
      setStartsAt({ date: "", time: "" });
      setClubSide("home");
      router.refresh();
      return;
    }

    toast.error(state.message);
  }, [state, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <DateTimeField
        idPrefix="match-starts-at"
        name="starts_at"
        value={startsAt}
        onChange={setStartsAt}
        dateLabel="Fecha del partido"
        timeLabel="Hora del partido"
        error={fieldErrors?.starts_at?.[0]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="club_side" label="Condición del club" error={fieldErrors?.club_side?.[0]}>
          <SelectInput
            id="club_side"
            name="club_side"
            value={clubSide}
            onChange={(event) => setClubSide(event.target.value as ClubMatchSide)}
          >
            {CLUB_MATCH_SIDES.map((side) => (
              <option key={side} value={side}>
                {CLUB_MATCH_SIDE_LABELS[side]}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField htmlFor="opponent_name" label="Rival" error={fieldErrors?.opponent_name?.[0]}>
          <TextInput id="opponent_name" name="opponent_name" type="text" placeholder="Ej: Unión Quilpué" />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="competition_name" label="Competencia opcional" error={fieldErrors?.competition_name?.[0]}>
          <TextInput id="competition_name" name="competition_name" type="text" placeholder="Ej: Liga local" />
        </FormField>

        <FormField htmlFor="category" label="Categoría opcional" error={fieldErrors?.category?.[0]}>
          <TextInput id="category" name="category" type="text" placeholder="Ej: Adulto, Senior, Sub-17" />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField htmlFor="location" label="Lugar opcional" error={fieldErrors?.location?.[0]}>
          <TextInput id="location" name="location" type="text" placeholder="Ej: Cancha Los Apóstoles" />
        </FormField>

        <FormField htmlFor="location_url" label="Link de ubicación opcional" error={fieldErrors?.location_url?.[0]}>
          <TextInput id="location_url" name="location_url" type="url" placeholder="https://maps.google.com/..." />
        </FormField>
      </div>

      <InfoBox>
        El partido se publicará automáticamente en el calendario público del club. El título se generará como{" "}
        <span className="font-medium text-font-main">
          {clubSide === "away" ? `Rival vs ${clubName}` : `${clubName} vs Rival`}
        </span>
        .
      </InfoBox>

      <FormSubmitButton pendingText="Creando...">Crear partido</FormSubmitButton>
    </form>
  );
}
