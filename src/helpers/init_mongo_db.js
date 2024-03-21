import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Mongo URI is not defined in the .env file");
    }

    await mongoose.connect(mongoUri, {
      dbName: "ZAG",
    });
    console.log("Mongo DataBase is Connected");
  } catch (error) {
    console.log(error);
  }

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db");
  });

  mongoose.connection.on("error", (err) => {
    console.error(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected.");
  });

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};

export default connectDB;
