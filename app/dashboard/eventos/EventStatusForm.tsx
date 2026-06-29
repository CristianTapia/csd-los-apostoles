"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateClubEventStatusAction } from "@/server/actions/update-club-event-status";
import type { ActionResult } from "@/server/actions/types";
import { CLUB_EVENT_STATUS_LABELS, CLUB_EVENT_STATUSES, type ClubEventStatus } from "@/server/schemas/calendar-event";
import { SelectInput } from "@/components/ui/form/FormField";
import { FormSubmitButton } from "@/components/ui/form/FormSubmitButton";

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

      <SelectInput
        name="status"
        value={selectedStatus}
        onChange={(event) => setSelectedStatus(event.target.value as ClubEventStatus)}
        className="sm:min-w-40"
      >
        {CLUB_EVENT_STATUSES.map((item) => (
          <option key={item} value={item}>
            {CLUB_EVENT_STATUS_LABELS[item]}
          </option>
        ))}
      </SelectInput>

      <FormSubmitButton pendingText="Guardando..." className="min-h-10 px-4">
        Guardar
      </FormSubmitButton>
    </form>
  );
}
