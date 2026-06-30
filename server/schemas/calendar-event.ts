import { z } from "zod";
import {
  optionalHexColorSchema,
  optionalHttpUrlSchema,
  optionalScoreSchema,
  optionalTextSchema,
  requiredDateTimeSchema,
} from "@/server/schemas/shared-fields";

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

export const createMatchEventSchema = z
  .object({
    starts_at: requiredDateTimeSchema({
      requiredMessage: "Selecciona fecha y hora del partido.",
      invalidMessage: "La fecha y hora no son válidas.",
    }),
    club_side: z.enum(CLUB_MATCH_SIDES),
    opponent_name: z
      .string()
      .trim()
      .min(2, "El rival debe tener al menos 2 caracteres.")
      .max(80, "El rival no puede superar los 80 caracteres."),
    location: optionalTextSchema,
    location_url: optionalHttpUrlSchema,
    competition_name: optionalTextSchema,
    category: optionalTextSchema,
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

export const updateMatchDetailsSchema = z
  .object({
    event_id: z.string().uuid(),
    status: z.enum(CLUB_EVENT_STATUSES),
    club_score: optionalScoreSchema,
    opponent_score: optionalScoreSchema,
  })
  .superRefine((value, ctx) => {
    const hasClubScore = value.club_score !== null;
    const hasOpponentScore = value.opponent_score !== null;

    if (hasClubScore !== hasOpponentScore) {
      ctx.addIssue({
        code: "custom",
        path: ["club_score"],
        message: "Debes ingresar ambos marcadores o dejar ambos vacíos.",
      });
    }

    if (value.status === "completed" && (value.club_score === null || value.opponent_score === null)) {
      ctx.addIssue({
        code: "custom",
        path: ["club_score"],
        message: "Un partido finalizado debe tener marcador.",
      });
    }

    if (value.status !== "completed" && (value.club_score !== null || value.opponent_score !== null)) {
      ctx.addIssue({
        code: "custom",
        path: ["club_score"],
        message: "Solo un partido finalizado puede tener marcador.",
      });
    }
  });

export type UpdateMatchDetailsInput = z.infer<typeof updateMatchDetailsSchema>;

export const updateMatchKitColorsSchema = z.object({
  event_id: z.string().uuid(),
  club_kit_color: optionalHexColorSchema,
  opponent_kit_color: optionalHexColorSchema,
});

export type UpdateMatchKitColorsInput = z.infer<typeof updateMatchKitColorsSchema>;
