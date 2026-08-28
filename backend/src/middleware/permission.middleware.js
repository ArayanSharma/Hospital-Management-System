import User from "../modules/users/user.model.js";
import AppError from "../core/errors/AppError.js";
import { ErrorCodes } from "../core/errors/errorCodes.js";

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate({
        path: "roleId",
        populate: { path: "permissionIds", select: "name" },
      });

      if (!user || !user.roleId) {
        throw new AppError("Access denied", 403, ErrorCodes.FORBIDDEN_PERMISSION);
      }

      const userPermissions = user.roleId.permissionIds.map((p) => p.name || p.toString());

      if (!userPermissions.includes(requiredPermission)) {
        throw new AppError(
          "You don't have permission to perform this action",
          403,
          ErrorCodes.FORBIDDEN_PERMISSION
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
