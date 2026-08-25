export const getRequestMeta = (req) => ({
  ipAddress: req.ip || req.headers["x-forwarded-for"] || null,
  userAgent: req.headers["user-agent"] || null,
});