import mongoose, { Schema, model } from "mongoose";

const listingSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  image: {
    data: Buffer, // Buffer type to store binary data
    contentType: String, // MIME type of the image
  },
  reviews: {
    type: [Schema.Types.ObjectId],
    ref: "Review",
    default: [],
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
});

const Listing = model("Listing", listingSchema);
export default Listing;
