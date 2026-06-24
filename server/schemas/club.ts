import { z } from "zod";
import { clubStatusSchema, nonEmptyTextSchema } from "@/server/schemas/common";

export const clubSlugSchema = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const clubSchema = z.object({
  name: nonEmptyTextSchema.max(120),
  slug: clubSlugSchema,
  status: clubStatusSchema.default("active"),
});

export const clubSettingsSchema = z.object({
  public_name: nonEmptyTextSchema.max(120),
  logo_url: z.string().url().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  primary_color: nonEmptyTextSchema.max(32),
  secondary_color: nonEmptyTextSchema.max(32),
  accent_color: nonEmptyTextSchema.max(32),
});
