import express from "express";
import "dotenv/config";
import connectDB from "./src/helpers/init_mongo_db.js";
import Profile from "./src/models/Profile.js";
import authRouter from "./src/services/Auth/route.js";
import createHttpError from "http-errors";
import listingRouter from "./src/services/Listings/route.js";
import reviewRouter from "./src/services/Reviews/route.js";

connectDB();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  res.send("welcome to home");
});

app.use("/auth", authRouter);
app.use("/listing", listingRouter);
app.use("/review", reviewRouter);

app.use(async (req, res, next) => {
  next(createHttpError.NotFound("this url does not exist!"));
});

app.use(async (error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
