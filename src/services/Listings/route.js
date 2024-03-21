import express from "express";
import { verifyAccessToken } from "../../middlewares/init_jwt.js";
import {
  getAllListing,
  addListing,
  getAllListingById,
  updateListing,
  deleteListing,
} from "./controller.js";
import isBusinessOwnerOrAdmin from "../../middlewares/isBusinessOwnerOrAdmin.js";
const listingRouter = express.Router();

listingRouter.get("/all", verifyAccessToken, getAllListing);
listingRouter.get("/all/:id", verifyAccessToken, getAllListingById);
listingRouter.post(
  "/add",
  verifyAccessToken,
  isBusinessOwnerOrAdmin,
  addListing
);
listingRouter.put(
  "/update/:id",
  verifyAccessToken,
  isBusinessOwnerOrAdmin,
  updateListing
);

listingRouter.delete(
  "/delete/:id",
  verifyAccessToken,
  isBusinessOwnerOrAdmin,
  deleteListing
);

export default listingRouter;
