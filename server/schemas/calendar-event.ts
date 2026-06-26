import { z } from "zod";

export const CLUB_EVENT_TYPES = [
  "match",
  "training",
  "meeting",
  "fundraiser",
  "community",
  "tournament",
  "other",
] as const;

export const CLUB_EVENT_STATUSES = ["scheduled", "completed", "cancelled", "postponed"] as const;

export const CLUB_MATCH_SIDES = ["home", "away", "neutral"] as const;

export type ClubEventType = (typeof CLUB_EVENT_TYPES)[number];
export type ClubEventStatus = (typeof CLUB_EVENT_STATUSES)[number];
export type ClubMatchSide = (typeof CLUB_MATCH_SIDES)[number];

export const CLUB_EVENT_TYPE_LABELS: Record<ClubEventType, string> = {
  match: "Partido",
  training: "Entrenamiento",
  meeting: "Reunión",
  fundraiser: "Rifa / campaña",
  community: "Actividad comunitaria",
  tournament: "Campeonato",
  other: "Otro",
};

export const CLUB_EVENT_STATUS_LABELS: Record<ClubEventStatus, string> = {
  scheduled: "Programado",
  completed: "Finalizado",
  cancelled: "Cancelado",
  postponed: "Postergado",
};

export const CLUB_MATCH_SIDE_LABELS: Record<ClubMatchSide, string> = {
  home: "Local",
  away: "Visita",
  neutral: "Neutral",
};

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const optionalUrl = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .refine((value) => value === null || isValidHttpUrl(value), {
    message: "Ingresa un link válido que empiece con http:// o https://.",
  });

export const createMatchEventSchema = z
  .object({
    starts_at: z
      .string()
      .min(1, "Selecciona fecha y hora del partido.")
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "La fecha y hora no son válidas.",
      }),

    club_side: z.enum(CLUB_MATCH_SIDES),

    opponent_name: z
      .string()
      .trim()
      .min(2, "El rival debe tener al menos 2 caracteres.")
      .max(80, "El rival no puede superar los 80 caracteres."),

    location: optionalText,
    location_url: optionalUrl,

    competition_name: optionalText,
    category: optionalText,
  })
  .superRefine((value, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startsAt = new Date(value.starts_at);

    if (startsAt < today) {
      ctx.addIssue({
        code: "custom",
        path: ["starts_at"],
        message: "No puedes crear un partido programado en una fecha anterior a hoy.",
      });
    }
  });

export type CreateMatchEventInput = z.infer<typeof createMatchEventSchema>;

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
