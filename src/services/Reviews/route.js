import express from "express";
import { verifyAccessToken } from "../../middlewares/init_jwt.js";
import isUser from "../../middlewares/isUser.js";
import isBusinessOwnerOrAdmin from "../../middlewares/isBusinessOwnerOrAdmin.js";
import {
  postReview,
  responseFormOwner,
  deleteReview,
  updateReviewByIdFromUser,
} from "./controller.js";
const reviewRouter = express.Router();

reviewRouter.post("/add/:listing_id", verifyAccessToken, isUser, postReview);

reviewRouter.put(
  "/update/:review_id",
  verifyAccessToken,
  isUser,
  updateReviewByIdFromUser
);
reviewRouter.put(
  "/response/:review_id",
  verifyAccessToken,
  isBusinessOwnerOrAdmin,
  responseFormOwner
);

reviewRouter.delete("/:review_id", verifyAccessToken, isUser, deleteReview);

export default reviewRouter;
