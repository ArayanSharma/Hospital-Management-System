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

const router = Router();

router.post("/", authenticate, checkPermission("user:create"), create);
router.get("/export", authenticate, checkPermission("user:read"), exportCSV);
router.get("/", authenticate, checkPermission("user:read"), getAll);
router.patch("/change-password", authenticate, changeUserPassword);
router.get("/:id", authenticate, checkPermission("user:read"), getById);
router.patch("/:id", authenticate, checkPermission("user:update"), update);
router.delete("/:id", authenticate, checkPermission("user:delete"), remove);

export default router;