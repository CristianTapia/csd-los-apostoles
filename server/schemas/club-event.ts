import { z } from "zod";
import type { ClubEventStatus } from "@/server/schemas/calendar-event";

export const NON_MATCH_CLUB_EVENT_TYPES = ["training", "meeting", "fundraiser", "community", "other"] as const;

export type NonMatchClubEventType = (typeof NON_MATCH_CLUB_EVENT_TYPES)[number];

export const NON_MATCH_CLUB_EVENT_TYPE_LABELS: Record<NonMatchClubEventType, string> = {
  training: "Entrenamiento",
  meeting: "Reunión",
  fundraiser: "Rifa / campaña",
  community: "Actividad comunitaria",
  other: "Otro",
};

const optionalText = z.preprocess((value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, z.string().nullable());

const optionalUrl = z
  .preprocess((value) => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, z.string().nullable())
  .refine((value) => value === null || isValidHttpUrl(value), {
    message: "Ingresa un link válido que empiece con http:// o https://.",
  });

export const createClubEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "El título debe tener al menos 3 caracteres.")
      .max(100, "El título no puede superar los 100 caracteres."),
    event_type: z.enum(NON_MATCH_CLUB_EVENT_TYPES),
    starts_at: z
      .string()
      .min(1, "Selecciona fecha y hora de inicio.")
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "La fecha de inicio no es válida.",
      }),
    ends_at: z
      .preprocess((value) => {
        if (typeof value !== "string") return null;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
      }, z.string().nullable())
      .refine((value) => value === null || !Number.isNaN(Date.parse(value)), {
        message: "La fecha de término no es válida.",
      }),
    location: optionalText,
    location_url: optionalUrl,
    description: optionalText,
  })
  .superRefine((value, ctx) => {
    if (!value.ends_at) return;

    const startsAt = new Date(value.starts_at);
    const endsAt = new Date(value.ends_at);

    if (endsAt <= startsAt) {
      ctx.addIssue({
        code: "custom",
        path: ["ends_at"],
        message: "La fecha de término debe ser posterior al inicio.",
      });
    }
  });

export type CreateClubEventInput = z.infer<typeof createClubEventSchema>;

export const updateClubEventStatusSchema = z.object({
  event_id: z.string().uuid(),
  status: z.enum(["scheduled", "completed", "cancelled", "postponed"]),
});

export type UpdateClubEventStatusInput = z.infer<typeof updateClubEventStatusSchema>;

export type DashboardClubEvent = {
  id: string;
  title: string;
  description: string | null;
  event_type: NonMatchClubEventType;
  status: ClubEventStatus;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  location_url: string | null;
  is_public: boolean;
};

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
