import { z } from "zod";

export const PERMISSION_ACTIONS = Object.freeze(["create", "read", "update", "delete", "manage"]);

export const createPermissionSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Permission name is required" })
      .trim()
      .min(3, "Permission name must be at least 3 characters")
      .max(100, "Permission name cannot exceed 100 characters"),

    resource: z
      .string({ required_error: "Resource is required" })
      .trim()
      .toLowerCase()
      .min(2, "Resource name must be at least 2 characters")
      .max(50, "Resource name cannot exceed 50 characters"),

    action: z.enum(["create", "read", "update", "delete", "manage"], {
      errorMap: () => ({
        message: "Action must be one of: create, read, update, delete, manage",
      }),
    }),

    description: z.string().trim().max(255, "Description cannot exceed 255 characters").optional(),
  }),
});

export const getByResourceSchema = z.object({
  params: z.object({
    resource: z
      .string({ required_error: "Resource param is required" })
      .trim()
      .min(1, "Resource name cannot be empty"),
  }),
});

export const deletePermissionSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: "Permission ID is required" })
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Mongo ObjectId format"),
  }),
});
