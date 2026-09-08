import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name is required").toUpperCase(),
  description: z.string().trim().optional(),
});