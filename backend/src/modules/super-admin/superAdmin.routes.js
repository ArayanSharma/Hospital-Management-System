import { Router } from "express";
import { dashboard, activity } from "./superAdmin.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";

const router = Router();

router.get("/dashboard", authenticate, checkPermission("dashboard:read"), dashboard);
router.get("/activity", authenticate, checkPermission("dashboard:read"), activity);

export default router;