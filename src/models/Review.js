import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    rating: {
      type: Number,
    },
    message: {
      type: String,
    },
    response: {
      type: String,
    },

    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    listing_id: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);
export default Review;
