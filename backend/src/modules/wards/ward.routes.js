import { Router } from "express";
import { create, getAll, getById, update, remove } from "./ward.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createWardSchema, updateWardSchema } from "./ward.validation.js";

const router = Router();

router.post("/", authenticate, checkPermission("ward:create"), validate(createWardSchema), create);
router.get("/", authenticate, checkPermission("ward:read"), getAll);
router.get("/:id", authenticate, checkPermission("ward:read"), getById);
router.patch("/:id", authenticate, checkPermission("ward:update"), validate(updateWardSchema), update);
router.delete("/:id", authenticate, checkPermission("ward:delete"), remove);

export default router;