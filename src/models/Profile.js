import mongoose, { Schema, model } from "mongoose";

const profileSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  Role: {
    type: String,
    default: "User",
    required: true,
  },
  reviewsGiven: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
});

const Profile = new model("Profile", profileSchema);
export default Profile;
