import { errorResponse } from "../core/responses/apiResponse.js";
import { ErrorCodes } from "../core/errors/errorCodes.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";
  let errorCode = err.errorCode || ErrorCodes.INTERNAL_SERVER_ERROR;
  const errors = err.errors || null;

  if (err.type === "entity.too.large" || err.status === 413) {
    statusCode = 413;
    message = "Uploaded file or report size is too large. Maximum allowed size is 50MB.";
    errorCode = ErrorCodes.VALIDATION_ERROR;
  }

  return errorResponse(res, statusCode, message, errorCode, errors);
};
