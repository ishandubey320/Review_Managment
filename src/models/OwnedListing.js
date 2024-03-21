import mongoose, { Schema, model } from "mongoose";

const ownedListingSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
    unique: true,
  },

  Listings: {
    type: [Schema.Types.ObjectId],
    ref: "Listing",
  },
});

const OwnedListing = model("OwnedListing", ownedListingSchema);
export default OwnedListing;
