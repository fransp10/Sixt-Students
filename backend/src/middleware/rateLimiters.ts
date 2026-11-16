import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Too many password reset attempts. Please try again after 15 minutes.",
  },
});

export const validationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  skipSuccessfulRequests: false, // authController return 200 for validation attempts, even if the validation fails, so we don't want to skip successful requests here
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many validation attempts. Please try again after 15 minutes.",
  },
});

export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30,
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Too many refresh token requests. Please try again after 15 minutes.",
  },
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes,
  limit: 1000,
  skipSuccessfulRequests: false, // we want to count all requests, even successful ones because the user might be spamming the endpoint with valid requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again after 15 minutes.",
  },
});
