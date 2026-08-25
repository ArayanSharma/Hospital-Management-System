import { errorResponse } from "../core/responses/apiResponse.js";
import { ErrorCodes } from "../core/errors/errorCodes.js";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const errors = err.errors?.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return errorResponse(
      res,
      400,
      "Validation failed",
      ErrorCodes.VALIDATION_ERROR,
      errors
    );
  }
};
