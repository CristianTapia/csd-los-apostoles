"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { createMatchEventAction } from "@/server/actions/create-match-event";
import type { ActionResult } from "@/server/actions/types";
import { CLUB_MATCH_SIDES, CLUB_MATCH_SIDE_LABELS, type ClubMatchSide } from "@/server/schemas/calendar-event";

type MatchEventFormProps = {
  clubName: string;
};

const initialState: ActionResult = {
  ok: false,
  message: "",
};

export function MatchEventForm({ clubName }: MatchEventFormProps) {
  const [state, formAction] = useActionState(createMatchEventAction, initialState);

  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [clubSide, setClubSide] = useState<ClubMatchSide>("home");
  const [opponentName, setOpponentName] = useState("");

  const startsAtIso = useMemo(() => {
    if (!matchDate || !matchTime) return "";

    const date = new Date(`${matchDate}T${matchTime}`);

    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString();
  }, [matchDate, matchTime]);

  const previewTitle = useMemo(() => {
    const rival = opponentName.trim() || "Rival";

    if (clubSide === "away") {
      return `${rival} vs ${clubName}`;
    }

    return `${clubName} vs ${rival}`;
  }, [clubName, clubSide, opponentName]);

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
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="starts_at" value={startsAtIso} />

      <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-xs font-medium uppercase tracking-wide text-font-secondary">Vista previa</p>

        <p className="mt-1 text-lg font-semibold text-font-main">{previewTitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="match_date" className="text-sm font-medium text-font-main">
            Fecha
          </label>

          <input
            id="match_date"
            type="date"
            value={matchDate}
            onChange={(event) => setMatchDate(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="match_time" className="text-sm font-medium text-font-main">
            Hora
          </label>

          <input
            id="match_time"
            type="time"
            value={matchTime}
            onChange={(event) => setMatchTime(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          />

          <FieldError errors={fieldErrors?.starts_at} />
        </div>

        <div className="space-y-2">
          <label htmlFor="club_side" className="text-sm font-medium text-font-main">
            Condición
          </label>

          <select
            id="club_side"
            name="club_side"
            value={clubSide}
            onChange={(event) => setClubSide(event.target.value as ClubMatchSide)}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          >
            {CLUB_MATCH_SIDES.map((side) => (
              <option key={side} value={side}>
                {CLUB_MATCH_SIDE_LABELS[side]}
              </option>
            ))}
          </select>

          <FieldError errors={fieldErrors?.club_side} />
        </div>

        <div className="space-y-2">
          <label htmlFor="opponent_name" className="text-sm font-medium text-font-main">
            Rival
          </label>

          <input
            id="opponent_name"
            name="opponent_name"
            type="text"
            value={opponentName}
            onChange={(event) => setOpponentName(event.target.value)}
            placeholder="Ej: Unión Quilpué"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          />

          <FieldError errors={fieldErrors?.opponent_name} />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium text-font-main">
            Lugar
          </label>

          <input
            id="location"
            name="location"
            type="text"
            placeholder="Ej: Cancha Los Apóstoles"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          />

          <FieldError errors={fieldErrors?.location} />
        </div>

        <div className="space-y-2">
          <label htmlFor="location_url" className="text-sm font-medium text-font-main">
            Link de ubicación
          </label>

          <input
            id="location_url"
            name="location_url"
            type="url"
            placeholder="Ej: https://maps.google.com/..."
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          />

          <FieldError errors={fieldErrors?.location_url} />
        </div>

        <div className="space-y-2">
          <label htmlFor="competition_name" className="text-sm font-medium text-font-main">
            Competencia opcional
          </label>

          <input
            id="competition_name"
            name="competition_name"
            type="text"
            placeholder="Ej: Liga local, Copa, Amistoso"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          />

          <FieldError errors={fieldErrors?.competition_name} />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-font-main">
            Categoría opcional
          </label>

          <input
            id="category"
            name="category"
            type="text"
            placeholder="Ej: Adulto, Senior, Juvenil"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-font-main outline-none focus:border-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
          />

          <FieldError errors={fieldErrors?.category} />
        </div>
      </div>

      <p className="text-xs text-font-secondary">
        El partido se publicará automáticamente en la página pública del club.
      </p>

      <SubmitButton pendingText="Creando partido...">Crear partido</SubmitButton>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;

  return <p className="text-xs text-red-600">{errors[0]}</p>;
}
