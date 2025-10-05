import express from "express";
import mongoose from "mongoose";
import SparePart from "./models/spare-part.js";
import catchAsync from "./utils/catchAsync.js";
import ExpressError from "./utils/ExpressError.js";
import validateSparePart from "./middleware/validateSparePart.js";
import sparePartRoutes from "./routes/spare-part.js";
import userRoutes from "./routes/user.js";

const app = express();

//depends what type of body parsing I want, for regular form -->
app.use(express.urlencoded({ extended: true }));
//for json - raw data -->
app.use(express.json());

app.use("/", userRoutes);
app.use("/spare-part-list", sparePartRoutes);

//to catch all route, if there is no match
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

//Error handler middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "SOMETHING WENT WRONG" } = err;
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message,
  });
});

export default app;
