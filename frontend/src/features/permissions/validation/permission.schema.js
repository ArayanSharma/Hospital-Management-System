import { z } from "zod";

export const createPermissionSchema = z.object({
  resource: z.string().trim().min(2, "Resource is required").toLowerCase(),
  action: z.enum(["create", "read", "update", "delete", "manage"]),
  description: z.string().trim().optional(),
});