import express from "express";
import { loginProfile } from "./controller.js";
const authRouter = express.Router();

authRouter.post("/login", loginProfile);

export default authRouter;
