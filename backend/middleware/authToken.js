const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      throw new Error("Token verification failed");
    }
  } else {
    throw new Error("No token found");
  }
});

module.exports = {protect};