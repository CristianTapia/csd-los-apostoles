"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateMatchDetailsAction } from "@/server/actions/update-match-details";
import type { ActionResult } from "@/server/actions/types";
import { CLUB_EVENT_STATUS_LABELS, CLUB_EVENT_STATUSES, type ClubEventStatus } from "@/server/schemas/calendar-event";
import type { DashboardMatchEvent } from "@/server/queries/get-dashboard-match-events";
import { FormField, SelectInput, TextInput } from "@/components/ui/form/FormField";
import { FormSubmitButton } from "@/components/ui/form/FormSubmitButton";

type MatchQuickUpdateFormProps = {
  match: DashboardMatchEvent;
};

const initialState: ActionResult = {
  ok: false,
  message: "",
};

export function MatchQuickUpdateForm({ match }: MatchQuickUpdateFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ClubEventStatus>(match.status);
  const [clubScore, setClubScore] = useState(match.club_score === null ? "" : String(match.club_score));
  const [opponentScore, setOpponentScore] = useState(match.opponent_score === null ? "" : String(match.opponent_score));

  const [state, formAction] = useActionState(updateMatchDetailsAction, initialState);

  const fieldErrors = state.ok ? undefined : state.fieldErrors;

  useEffect(() => {
    if (!state.message) return;

    if (state.ok) {
      toast.success(state.message);
      router.refresh();
      return;
    }

    toast.error(state.message);
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="event_id" value={match.id} />

      <div className="grid gap-4 md:grid-cols-3">
        <FormField htmlFor={`status-${match.id}`} label="Estado" error={fieldErrors?.status?.[0]}>
          <SelectInput
            id={`status-${match.id}`}
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ClubEventStatus)}
          >
            {CLUB_EVENT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {CLUB_EVENT_STATUS_LABELS[item]}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <FormField htmlFor={`club-score-${match.id}`} label="Goles club" error={fieldErrors?.club_score?.[0]}>
          <TextInput
            id={`club-score-${match.id}`}
            name="club_score"
            type="number"
            min={0}
            inputMode="numeric"
            value={clubScore}
            onChange={(event) => setClubScore(event.target.value)}
            placeholder="Ej: 2"
          />
        </FormField>

        <FormField htmlFor={`opponent-score-${match.id}`} label="Goles rival" error={fieldErrors?.opponent_score?.[0]}>
          <TextInput
            id={`opponent-score-${match.id}`}
            name="opponent_score"
            type="number"
            min={0}
            inputMode="numeric"
            value={opponentScore}
            onChange={(event) => setOpponentScore(event.target.value)}
            placeholder="Ej: 1"
          />
        </FormField>
      </div>

      <FormSubmitButton pendingText="Guardando...">Guardar resultado</FormSubmitButton>
    </form>
  );
}
