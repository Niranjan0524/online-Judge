const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const createLimiter = ({ windowMs, limit, message, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests,
    keyGenerator: (req) => {
      if (req.userId) return `user:${req.userId}`;
      const ip = req.ip || req.socket.remoteAddress;
      return ip ? ipKeyGenerator(ip) : "unknown";
    },
    message: { message },
  });

const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: "Too many login attempts. Please try again later.",
});

const signupLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: "Too many signup attempts. Please try again later.",
});

const costlyEndpointLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 10,
  message: "Too many requests. Please wait before trying again.",
});

const resumeReviewLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: "Resume review limit reached. Please try again later.",
});

module.exports = {
  loginLimiter,
  signupLimiter,
  costlyEndpointLimiter,
  resumeReviewLimiter,
};
