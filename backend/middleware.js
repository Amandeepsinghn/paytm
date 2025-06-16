const { JWT_SECRET } = require("./config.js");
const jwt = require("jsonwebtoken");

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("bearer")) {
    return res.status(403).json({
      error: "authheader is not in the correct format",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(403).json({
      error: "error while authenticating",
    });
  }
};

module.exports = {
  authMiddleWare,
};
