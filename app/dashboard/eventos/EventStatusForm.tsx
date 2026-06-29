"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateClubEventStatusAction } from "@/server/actions/update-club-event-status";
import type { ActionResult } from "@/server/actions/types";
import { CLUB_EVENT_STATUS_LABELS, CLUB_EVENT_STATUSES, type ClubEventStatus } from "@/server/schemas/calendar-event";

const initialState: ActionResult = {
  ok: false,
  message: "",
};

export function EventStatusForm({ eventId, status }: { eventId: string; status: ClubEventStatus }) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [state, formAction] = useActionState(updateClubEventStatusAction, initialState);

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
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
      <input type="hidden" name="event_id" value={eventId} />

      <select
        name="status"
        value={selectedStatus}
        onChange={(event) => setSelectedStatus(event.target.value as ClubEventStatus)}
        className="min-h-10 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-black/30 dark:border-white/10 dark:bg-neutral-950"
      >
        {CLUB_EVENT_STATUSES.map((item) => (
          <option key={item} value={item}>
            {CLUB_EVENT_STATUS_LABELS[item]}
          </option>
        ))}
      </select>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
    >
      {pending ? "Guardando..." : "Guardar"}
    </button>
  );
}
