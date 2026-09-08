import { Router } from "express";
import { getMine, markRead, markAllRead } from "./notification.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

// NOTE: Yahan checkPermission jaan-boojh kar nahi lagaya — har logged-in user
// apni khud ki notifications dekh/manage kar sakta hai, koi special permission nahi chahiye
router.get("/", authenticate, routeCache(30, "hms:route:notification", true), getMine);
router.patch("/:id/read", authenticate, markRead);
router.patch("/mark-all-read", authenticate, markAllRead);

export default router;