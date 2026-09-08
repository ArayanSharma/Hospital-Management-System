import { Router } from "express";
import { create, getAll, getById, getByVisit, update } from "./prescription.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { createPrescriptionSchema, updatePrescriptionSchema } from "./prescription.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermission("prescription:create"),
  validate(createPrescriptionSchema),
  create
);
router.get("/", authenticate, checkPermission("prescription:read"), routeCache(60, "hms:route:prescription", true), getAll);
router.get("/visit/:visitId", authenticate, checkPermission("prescription:read"), routeCache(300, "hms:route:prescription", true), getByVisit);
router.get("/:id", authenticate, checkPermission("prescription:read"), routeCache(300, "hms:route:prescription", true), getById);
router.patch(
  "/:id",
  authenticate,
  checkPermission("prescription:update"),
  validate(updatePrescriptionSchema),
  update
);

export default router;