import { z } from "zod";

export const updateAdminClubModulesSchema = z.object({
  club_id: z.string().uuid(),
  allowed_module_ids: z.array(z.string().uuid()),
});

export type UpdateAdminClubModulesInput = z.infer<typeof updateAdminClubModulesSchema>;
