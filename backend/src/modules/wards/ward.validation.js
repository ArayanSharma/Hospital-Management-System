import { z } from "zod";

export const createWardSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Ward name is required"),
    type: z.enum(["general", "icu", "private", "semi-private", "emergency"]),
    floor: z.string().trim().optional(),
    capacity: z.number().min(1, "Capacity must be at least 1"),
  }),
});

export const updateWardSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
    type: z.enum(["general", "icu", "private", "semi-private", "emergency"]).optional(),
    floor: z.string().trim().optional(),
    capacity: z.number().min(1).optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});