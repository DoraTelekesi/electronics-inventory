import jwt from "jsonwebtoken";
import ExpressError from "../utils/ExpressError.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new ExpressError("Access denied. No token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return next(new ExpressError("Invalid token", 403));
  }
};

export default authenticateToken;
