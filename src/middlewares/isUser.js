import Profile from "../models/Profile.js";

async function isUser(req, res, next) {
  try {
    const userId = req.payload.aud;
    const user = await Profile.findById(userId);
    if (user && (user.Role.includes("Admin") || user.Role.includes("User"))) {
      req.payload.role = user.Role;
      next();
    } else
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
  } catch (error) {
    next(error);
  }
}

export default isUser;
