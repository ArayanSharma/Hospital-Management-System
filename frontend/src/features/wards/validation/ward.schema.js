import { z } from "zod";

export const wardSchema = z.object({
  name: z.string().trim().min(2, "Ward name is required"),
  type: z.enum(["general", "icu", "private", "semi-private", "emergency"]),
  floor: z.string().trim().optional(),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});
