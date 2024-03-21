import createHttpError from "http-errors";
import Profile from "../../models/Profile.js";
import Review from "../../models/Review.js";
import Listing from "../../models/Listing.js";

export const postReview = async (req, res, next) => {
  try {
    const { listing_id } = req.params;
    const { message, rating } = req.body;
    const profile_id = req.payload.aud;
    const role = req.payload.role;

    const user = await Profile.findById(profile_id);
    const allReviewsGiven = user.reviewsGiven;
    const listing = await Listing.findById(listing_id);

    if (!listing) return res.status(404).send("No Listing found");

    const owner_id = listing.owner_id;

    const reviewGivenToThisListing = allReviewsGiven.some((id) => {
      return id.toString() === listing_id;
    });

    if (reviewGivenToThisListing)
      return res
        .status(400)
        .send("Already given Review, update it if you want to change");

    if (!message) return res.status(400).send("Please write a review");

    const review = new Review({
      user_id: profile_id,
      message: message,
      rating: rating || 3,
      owner_id: owner_id,
      listing_id: listing_id,
    });

    await review.save();
    listing.reviews.push(review._id);
    await listing.save();
    user.reviewsGiven.push(listing_id);
    await user.save();

    res.send(review);
  } catch (error) {
    next(error);
  }
};

export const updateReviewByIdFromUser = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { message, rating } = req.body;
    const profile_id = req.payload.aud;
    const role = req.payload.role;

    const review = await Review.findById(review_id);

    if (!review) return res.status(404).send("no review found for given id");

    if (role !== "Admin" && profile_id !== review.user_id.toString())
      return res
        .status(401)
        .send("User is not authorized to update this review");

    if (message) review.message = message;

    if (rating) review.rating = rating;

    await review.save();
    res.send(review);
  } catch (error) {
    next(error);
  }
};

export const responseFormOwner = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { response } = req.body;
    const profile_id = req.payload.aud;
    const role = req.Role;
    const review = await Review.findById(review_id);

    if (!review) return res.status(404).send("review not found");

    if (role !== "Admin" && profile_id !== review.owner_id.toString())
      return res.status(404).send("You cant reply to this response");

    if (!response) return res.status(400).send("Please add response");

    review.response = response;
    await review.save();

    res.send(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { review_id } = req.params;

    const profile_id = req.payload.aud;
    const role = req.payload.role;
    const review = await Review.findById(review_id);
    if (!review) return res.status(404).send("review not found");

    if (role !== "Admin" && profile_id !== review.user_id.toString())
      return res.status(404).send("You cant Delete to this response");

    const user = await Profile.findById(review.user_id);
    const listing = await Listing.findById(review.listing_id);

    const newReviewGiven = user.reviewsGiven.filter(
      (id) => id.toString() !== review.listing_id.toString()
    );

    const newListingReviews = listing.reviews.filter(
      (id) => id.toString() !== review._id.toString()
    );

    user.reviewsGiven = newReviewGiven;
    listing.reviews = newListingReviews;

    await user.save();
    await listing.save();

    await Review.findByIdAndDelete(review_id);

    res.send("Deleted Successfully");
  } catch (error) {
    next(error);
  }
};
