import { z } from "zod";

export const createAdminClubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede superar los 100 caracteres."),
  slug: z
    .string()
    .trim()
    .min(2, "El slug debe tener al menos 2 caracteres.")
    .max(80, "El slug no puede superar los 80 caracteres.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa solo minusculas, numeros y guiones."),
  owner_email: z.string().trim().email("Ingresa un email valido."),
});

export type CreateAdminClubInput = z.infer<typeof createAdminClubSchema>;
