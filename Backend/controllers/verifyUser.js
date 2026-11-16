const jwt = require("jsonwebtoken");


exports.verifyUser = (req, res, next) => {  

  const authHeader = req.headers.authorization;
  if (!authHeader ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  if (!id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.userId= id;

  next();
}
