import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Ingresa un email valido."),
  password: z.string().min(1, "Ingresa tu password."),
  next: z.string().optional(),
});
