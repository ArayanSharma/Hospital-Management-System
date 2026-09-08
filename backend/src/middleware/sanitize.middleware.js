/**
 * Recursively strips MongoDB query operators starting with '$' or containing '.' from objects/arrays
 * Prevents NoSQL Injection vulnerabilities (e.g. { username: { "$ne": null }, password: { "$gt": "" } })
 */
function sanitizeInPlace(obj) {
  if (obj === null || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeInPlace(obj[key]);
    }
  }
}

/**
 * Middleware to sanitize req.body, req.query, and req.params in-place for Express 5 compatibility
 */
export function mongoSanitizeMiddleware(req, res, next) {
  if (req.body && typeof req.body === "object") {
    sanitizeInPlace(req.body);
  }
  if (req.query && typeof req.query === "object") {
    sanitizeInPlace(req.query);
  }
  if (req.params && typeof req.params === "object") {
    sanitizeInPlace(req.params);
  }
  next();
}

