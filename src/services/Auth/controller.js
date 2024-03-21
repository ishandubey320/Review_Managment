import { generateAccessToken } from "../../middlewares/init_jwt.js";
import Profile from "../../models/Profile.js";

export const loginProfile = async (req, res, next) => {
  try {
    const { user_name } = req.body;
    const isUserExist = await Profile.findOne({ user_name: user_name });
    if (!isUserExist) return res.status(404).send("User does not Exist");

    const userId = isUserExist._id;

    const access_token = await generateAccessToken(userId.toString());
    res.send(access_token);
  } catch (error) {
    next(error);
  }
};
