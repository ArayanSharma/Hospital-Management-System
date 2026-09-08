import { Router } from "express";
import { dashboard, activity } from "./superAdmin.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.get("/dashboard", authenticate, checkPermission("dashboard:read"), routeCache(300, "hms:route:superadmin", true), dashboard);
router.get("/activity", authenticate, checkPermission("dashboard:read"), routeCache(60, "hms:route:superadmin", true), activity);

export default router;