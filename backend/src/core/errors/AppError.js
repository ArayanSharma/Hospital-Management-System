class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = null, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;