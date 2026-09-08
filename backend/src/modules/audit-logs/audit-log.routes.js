import { Router } from "express";
import { getAll, getByResourceId } from "./audit-log.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

// Sirf GET routes — audit logs kabhi update/delete nahi hone chahiye API se
router.get("/", authenticate, checkPermission("audit_log:read"), routeCache(60, "hms:route:audit", true), getAll);
router.get("/:resourceId", authenticate, checkPermission("audit_log:read"), routeCache(300, "hms:route:audit", true), getByResourceId);

export default router;