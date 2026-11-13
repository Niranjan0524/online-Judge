const { timingSafeEqual } = require("crypto");

const requireCompilerSecret = (req, res, next) => {
  const expected = process.env.COMPILER_API_SECRET;
  const supplied = req.get("x-compiler-secret") || "";

  if (!expected) {
    return res.status(503).json({ message: "Compiler service is not configured" });
  }

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  if (
    expectedBuffer.length !== suppliedBuffer.length ||
    !timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
};

module.exports = requireCompilerSecret;
