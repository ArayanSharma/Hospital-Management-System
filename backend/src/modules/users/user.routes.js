import { Router } from "express";
import {
  create,
  exportCSV,
  getById,
  getAll,
  update,
  changeUserPassword,
  remove,
} from "./user.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { routeCache } from "../../middleware/cache.middleware.js";

const router = Router();

router.post("/", authenticate, checkPermission("user:create"), create);
router.get("/export", authenticate, checkPermission("user:read"), exportCSV);
router.get("/", authenticate, checkPermission("user:read"), routeCache(60, "hms:route:user", true), getAll);
router.patch("/change-password", authenticate, changeUserPassword);
router.get("/:id", authenticate, checkPermission("user:read"), routeCache(300, "hms:route:user", true), getById);
router.patch("/:id", authenticate, checkPermission("user:update"), update);
router.delete("/:id", authenticate, checkPermission("user:delete"), remove);

export default router;