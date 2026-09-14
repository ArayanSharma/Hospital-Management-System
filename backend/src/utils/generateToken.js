import jwt from "jsonwebtoken";

const getAccessSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing in environment variables!");
  }
  return secret;
};

const getRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is missing in environment variables!");
  }
  return secret;
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, getAccessSecret(), { expiresIn: "15m" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: "7d" });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshSecret());
};

