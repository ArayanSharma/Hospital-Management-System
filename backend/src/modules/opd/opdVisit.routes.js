import { Router } from "express";
import { create, getAll, getById, update } from "./opdVisit.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createOPDVisitSchema, updateOPDVisitSchema } from "./opdVisit.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("opd:create"),
  validate(createOPDVisitSchema),
  create
);
router.get("/", authenticate, checkPermission("opd:read"), getAll);
router.get("/:id", authenticate, checkPermission("opd:read"), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("opd:update"),
  validate(updateOPDVisitSchema),
  update
);

export default router;