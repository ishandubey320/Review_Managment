import createHttpError from "http-errors";
import OwnedListing from "../../models/OwnedListing.js";
import Listing from "../../models/Listing.js";

export const getAllListing = async (req, res, next) => {
  try {
    OwnedListing.find({})
      .populate("Listings")
      .exec()
      .then((data) => res.send(data))
      .catch((error) => console.log(error));
  } catch (error) {
    next(error);
  }
};

export const addListing = async (req, res, next) => {
  try {
    const { name, city, phone, address, image } = req.body;
    const profile_id = req.payload.aud;
    const ownedListing = await OwnedListing.findOne({ owner_id: profile_id });

    if (!name || !city || !phone)
      return res.status(400).send("Data is not complete please check");

    const newListing = new Listing({
      Name: name,
      phone: phone,
      city: city,
      address: address ?? "",
      image: image ?? "",
      owner_id: profile_id,
    });
    await newListing.save();

    // if the Business Owner does not Owned any listing
    if (!ownedListing) {
      const newOwnedListing = new OwnedListing({
        owner_id: profile_id,
      });
      await newOwnedListing.save();
    }
    const newOwnedListing = await OwnedListing.findOne({
      owner_id: profile_id,
    });
    newOwnedListing.Listings.push(newListing._id);
    await newOwnedListing.save();

    res.send(newOwnedListing);
  } catch (error) {
    next(error);
  }
};

export const getAllListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) return next(createHttpError.NotFound("Listing not found"));

    res.send(listing);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, city, phone, address, image } = req.body;
    const role = req.payload.role;
    const profile_id = req.payload.aud;
    const listing = await Listing.findById(id);

    if (!listing) return next(createHttpError.NotFound("Listing not found"));

    if (role !== "Admin" && profile_id != listing.owner_id.toString())
      return res.send("Your are not the Owner of This Listing");

    if (name) listing.Name = name;

    if (city) listing.city = city;

    if (phone) listing.phone = phone;

    if (address) listing.address = address;

    if (image) listing.image = image;

    await listing.save();

    res.send(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.payload.role;
    const profile_id = req.payload.aud;
    const listing = await Listing.findById(id);

    if (!listing) return next(createHttpError.NotFound("Listing not found"));

    if (role != "Admin" && profile_id != listing.owner_id.toString())
      return res.send("Your are not the Owner of This Listing");

    const ownedListing = await OwnedListing.findOne({
      owner_id: listing.owner_id,
    });

    const newListings = ownedListing.Listings.filter(
      (listing_id) => listing_id.toString() !== id.toString()
    );
    ownedListing.Listings = newListings;
    ownedListing.save();
    await Listing.findByIdAndDelete(id);
    res.status(201).send("Listing with given Id deleted");
  } catch (error) {
    next(error);
  }
};
