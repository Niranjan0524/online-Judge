const User = require("../models/user");

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("type");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.type !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    return next();
  } catch (error) {
    console.error("Error checking admin access:", error);
    return res.status(500).json({ message: "Unable to verify permissions" });
  }
};

module.exports = requireAdmin;
