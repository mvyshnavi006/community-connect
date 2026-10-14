const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authorized. No token provided." });

    const token   = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ message: "Not authorized. User not found." });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized. Invalid or expired token." });
  }
};

module.exports = { protect };
