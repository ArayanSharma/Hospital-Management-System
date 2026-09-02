import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createRoleSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Role name is required" })
      .trim()
      .min(2, "Role name must be at least 2 characters")
      .max(50, "Role name cannot exceed 50 characters")
      .toUpperCase(),

    roleCode: z.string().trim().optional(),
    roleType: z.enum(["System", "Custom"]).optional(),
    status: z.enum(["active", "inactive"]).optional(),
    description: z.string().trim().max(255, "Description cannot exceed 255 characters").optional(),
    parentRole: z.string().optional(),
    maxUsers: z.number().nullable().optional(),

    permissionIds: z
      .array(
        z.string().regex(objectIdRegex, "Invalid permission ObjectId format"),
        { invalid_type_error: "permissionIds must be an array of IDs" }
      )
      .optional(),

    modulePermissions: z.record(z.string()).optional(),
    actionPermissions: z.record(z.object({
      create: z.boolean().optional(),
      read: z.boolean().optional(),
      update: z.boolean().optional(),
      delete: z.boolean().optional(),
      manage: z.boolean().optional(),
    })).optional(),
  }),
});

export const updateRolePermissionsSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: "Role ID is required" })
      .regex(objectIdRegex, "Invalid Role ObjectId format"),
  }),
  body: z.object({
    name: z.string().optional(),
    roleCode: z.string().optional(),
    roleType: z.enum(["System", "Custom"]).optional(),
    status: z.enum(["active", "inactive"]).optional(),
    description: z.string().optional(),
    parentRole: z.string().optional(),
    maxUsers: z.number().nullable().optional(),
    permissionIds: z.array(z.string()).optional(),
    modulePermissions: z.record(z.string()).optional(),
    actionPermissions: z.record(z.object({
      create: z.boolean().optional(),
      read: z.boolean().optional(),
      update: z.boolean().optional(),
      delete: z.boolean().optional(),
      manage: z.boolean().optional(),
    })).optional(),
  }),
});

export const roleIdParamSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: "Role ID is required" })
      .regex(objectIdRegex, "Invalid Role ObjectId format"),
  }),
});
