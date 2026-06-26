"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { updateMatchDetailsAction } from "@/server/actions/update-match-details";
import type { ActionResult } from "@/server/actions/types";
import { CLUB_EVENT_STATUSES, CLUB_EVENT_STATUS_LABELS, type ClubEventStatus } from "@/server/schemas/calendar-event";
import type { DashboardMatchEvent } from "@/server/queries/get-dashboard-match-events";

type MatchQuickUpdateFormProps = {
  match: DashboardMatchEvent;
};

const initialState: ActionResult = {
  ok: false,
  message: "",
};

export function MatchQuickUpdateForm({ match }: MatchQuickUpdateFormProps) {
  const router = useRouter();

  const [state, formAction] = useActionState(updateMatchDetailsAction, initialState);

  const [status, setStatus] = useState<ClubEventStatus>(match.status);
  const [clubScore, setClubScore] = useState(match.club_score === null ? "" : String(match.club_score));
  const [opponentScore, setOpponentScore] = useState(match.opponent_score === null ? "" : String(match.opponent_score));

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
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <input type="hidden" name="event_id" value={match.id} />

      <div>
        <p className="text-sm font-semibold text-font-main">Estado y marcador</p>

        <p className="mt-1 text-xs text-font-secondary">
          El marcador solo se puede guardar cuando el partido está finalizado.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor={`status-${match.id}`} className="text-sm font-medium text-font-main">
            Estado
          </label>

          <select
            id={`status-${match.id}`}
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ClubEventStatus)}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          >
            {CLUB_EVENT_STATUSES.map((eventStatus) => (
              <option key={eventStatus} value={eventStatus}>
                {CLUB_EVENT_STATUS_LABELS[eventStatus]}
              </option>
            ))}
          </select>

          <FieldError errors={fieldErrors?.status} />
        </div>

        <div className="space-y-2">
          <label htmlFor={`club-score-${match.id}`} className="text-sm font-medium text-font-main">
            Goles club
          </label>

          <input
            id={`club-score-${match.id}`}
            name="club_score"
            type="number"
            min="0"
            value={clubScore}
            onChange={(event) => setClubScore(event.target.value)}
            placeholder="—"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          />

          <FieldError errors={fieldErrors?.club_score} />
        </div>

        <div className="space-y-2">
          <label htmlFor={`opponent-score-${match.id}`} className="text-sm font-medium text-font-main">
            Goles rival
          </label>

          <input
            id={`opponent-score-${match.id}`}
            name="opponent_score"
            type="number"
            min="0"
            value={opponentScore}
            onChange={(event) => setOpponentScore(event.target.value)}
            placeholder="—"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          />

          <FieldError errors={fieldErrors?.opponent_score} />
        </div>
      </div>

      <SubmitButton pendingText="Guardando resultado...">Guardar resultado</SubmitButton>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs text-red-600">{errors[0]}</p>;
}
