import { Router } from "express";
import { register, login, googleLogin, refresh, logout, me, getOptions, completeProfile } from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { routeCache } from "../../middleware/cache.middleware.js";
import { authRateLimiter } from "../../middleware/rateLimiter.middleware.js";

const router = Router();

router.get("/registration-options", routeCache(3600, "hms:route:auth:opts", false), getOptions);
router.post("/register", authRateLimiter, validate(registerSchema), register);
router.post("/login", authRateLimiter, validate(loginSchema), login);
router.post("/google-login", authRateLimiter, googleLogin);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, routeCache(300, "hms:route:auth:me", true), me);
router.put("/complete-profile", authenticate, completeProfile);

export default router;