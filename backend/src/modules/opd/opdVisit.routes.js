import { Router } from "express";
import { create, getAll, getById, update } from "./opdVisit.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createOPDVisitSchema, updateOPDVisitSchema } from "./opdVisit.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("opd:create"),
  validate(createOPDVisitSchema),
  create
);
router.get("/", authenticate, checkPermission("opd:read"), routeCache(60, "hms:route:opd", true), getAll);
router.get("/:id", authenticate, checkPermission("opd:read"), routeCache(300, "hms:route:opd", true), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("opd:update"),
  validate(updateOPDVisitSchema),
  update
);

export default router;