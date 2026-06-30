import { z } from "zod";

type RequiredDateTimeOptions = {
  requiredMessage: string;
  invalidMessage: string;
};

type OptionalDateTimeOptions = {
  invalidMessage: string;
};

export const optionalTextSchema = z.preprocess((value) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}, z.string().nullable());

export const optionalHttpUrlSchema = z
  .preprocess((value) => {
    if (typeof value !== "string") return null;

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : null;
  }, z.string().nullable())
  .refine((value) => value === null || isValidHttpUrl(value), {
    message: "Ingresa un link válido que empiece con http:// o https://.",
  });

export function requiredDateTimeSchema({ requiredMessage, invalidMessage }: RequiredDateTimeOptions) {
  return z
    .preprocess(
      (value) => {
        if (typeof value !== "string") return "";

        return value.trim();
      },
      z.string().min(1, requiredMessage),
    )
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: invalidMessage,
    });
}

export function optionalDateTimeSchema({ invalidMessage }: OptionalDateTimeOptions) {
  return z
    .preprocess((value) => {
      if (typeof value !== "string") return null;

      const trimmed = value.trim();

      return trimmed.length > 0 ? trimmed : null;
    }, z.string().nullable())
    .refine((value) => value === null || !Number.isNaN(Date.parse(value)), {
      message: invalidMessage,
    });
}

export const optionalScoreSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return null;

  return Number(value);
}, z.number().int().min(0, "El marcador no puede ser negativo.").nullable());

export const optionalHexColorSchema = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return null;

    return value;
  },
  z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Selecciona un color válido.")
    .nullable(),
);

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
