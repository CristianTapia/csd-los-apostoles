import { z } from "zod";
import { CLUB_EVENT_STATUSES, type ClubEventStatus } from "@/server/schemas/calendar-event";
import {
  optionalDateTimeSchema,
  optionalHttpUrlSchema,
  optionalTextSchema,
  requiredDateTimeSchema,
} from "@/server/schemas/shared-fields";

export const NON_MATCH_CLUB_EVENT_TYPES = ["training", "meeting", "fundraiser", "community", "other"] as const;

export type NonMatchClubEventType = (typeof NON_MATCH_CLUB_EVENT_TYPES)[number];

export const NON_MATCH_CLUB_EVENT_TYPE_LABELS: Record<NonMatchClubEventType, string> = {
  training: "Entrenamiento",
  meeting: "Reunión",
  fundraiser: "Rifa / campaña",
  community: "Actividad comunitaria",
  other: "Otro",
};

export const createClubEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "El título debe tener al menos 3 caracteres.")
      .max(100, "El título no puede superar los 100 caracteres."),
    event_type: z.enum(NON_MATCH_CLUB_EVENT_TYPES),
    starts_at: requiredDateTimeSchema({
      requiredMessage: "Selecciona fecha y hora de inicio.",
      invalidMessage: "La fecha de inicio no es válida.",
    }),
    ends_at: optionalDateTimeSchema({
      invalidMessage: "La fecha de término no es válida.",
    }),
    location: optionalTextSchema,
    location_url: optionalHttpUrlSchema,
    description: optionalTextSchema,
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
  status: z.enum(CLUB_EVENT_STATUSES),
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
