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
  res.send("welcome home to za");

  // const profile1 = new Profile({
  //   user_name: "Ishan",
  // });
  // const profile2 = new Profile({
  //   user_name: "Rishin",
  //   Role: "Business_Owner",
  // });
  // const profile5 = new Profile({
  //   user_name: "Rudra",
  //   Role: "Business_Owner",
  // });
  // const profile3 = new Profile({
  //   user_name: "Harshit",
  // });
  // const profile4 = new Profile({
  //   user_name: "Zag_Team",
  //   Role: "Admin",
  // });
  // await profile1.save();
  // await profile2.save();
  // await profile3.save();
  // await profile4.save();
  // await profile5.save();
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
