import { errorResponse } from "../core/responses/apiResponse.js";
import { ErrorCodes } from "../core/errors/errorCodes.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorCode = err.errorCode || ErrorCodes.INTERNAL_SERVER_ERROR;
  const errors = err.errors || null;

  return errorResponse(res, statusCode, message, errorCode, errors);
};
