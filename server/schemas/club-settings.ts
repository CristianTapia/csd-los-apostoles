import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null))
  .pipe(z.string().url("Debe ser una URL válida.").nullable());

const colorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Debe ser un color hexadecimal válido. Ejemplo: #111827");

export const updateClubSettingsSchema = z.object({
  public_name: z
    .string()
    .trim()
    .min(2, "El nombre público debe tener al menos 2 caracteres.")
    .max(80, "El nombre público no puede superar los 80 caracteres."),

  primary_color: colorSchema,
  secondary_color: colorSchema,
  accent_color: colorSchema,

  logo_url: optionalUrlSchema,
  cover_image_url: optionalUrlSchema,
});

export type UpdateClubSettingsInput = z.infer<typeof updateClubSettingsSchema>;
