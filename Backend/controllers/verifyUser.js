const jwt = require("jsonwebtoken");


exports.verifyUser = (req, res, next) => {  

  console.log("1");
  const authHeader = req.headers.authorization;
  if (!authHeader ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log("2");
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log("3");

  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  console.log("Decoded userId:", id);
  if (!id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.userId= id;

  next();
}