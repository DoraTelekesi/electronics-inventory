import express from "express";
import mongoose from "mongoose";
import SparePart from "./models/spare-part.js";
import catchAsync from "./utils/catchAsync.js";
import ExpressError from "./utils/ExpressError.js";

const app = express();

//depends what type of body parsing I want, for regular form -->
app.use(express.urlencoded({ extended: true }));
//for json - raw data -->
app.use(express.json());

app.get(
  "/spare-part-list",
  catchAsync(async (req, res, next) => {
    const spareParts = await SparePart.find({});
    if (spareParts.length === 0) {
      return next(new ExpressError("No Spare Parts in the List", 404));
    }
    console.log(spareParts);
    res.status(200).json({
      message: "Spare parts retrieved",
      spareParts,
    });
  })
);

app.get(
  "/spare-part-list/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const sparePart = await SparePart.findById(id);
    if (!sparePart) {
      return next(new ExpressError("Spare Part Not Found", 404));
    }
    console.log(sparePart);
    res.status(200).json({
      message: `Spare part retrieved ${sparePart.model}, ${sparePart.type} for showing`,
      sparePart,
    });
  })
);

app.get(
  "/spare-part-list/:id/edit",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const sparePart = await SparePart.findById(id);
    if (!sparePart) {
      return next(new ExpressError("Spare Part Not Found", 404));
    }
    console.log(sparePart);
    res.status(200).json({
      message: `Spare part ${sparePart.model}, ${sparePart.type} retrieved for editing`,
      sparePart,
    });
  })
);

app.put(
  "/spare-part-list/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { manufacturer, model, type, depot, amount } = req.body;
    if (!manufacturer || !model || !type || !depot || amount == null) {
      return next(new ExpressError("Invalid Spare Part Data", 400));
    }

    const sparePart = await SparePart.findByIdAndUpdate(id, req.body, { new: true });
    if (!sparePart) {
      return next(new ExpressError("Spare Part Not Found", 404));
    }

    res.status(200).json({
      message: `Spare Part ${sparePart.model}, ${sparePart.type} updated`,
      sparePart,
    });
  })
);

app.post(
  "/spare-part-list",
  catchAsync(async (req, res, next) => {
    const { manufacturer, model, type, depot, amount } = req.body;
    if (!manufacturer || !model || !type || !depot || amount == null) {
      return next(new ExpressError("Invalid Spare Part Data", 400));
    }
    const newSparePart = new SparePart(req.body);
    await newSparePart.save();
    console.log(newSparePart);
    res.status(201).json({
      message: "New item added",
      sparePart: newSparePart,
    });
  })
);

app.delete(
  "/spare-part-list/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const sparePart = await SparePart.findByIdAndDelete(id);
    if (!sparePart) {
      return next(new ExpressError("Spare Part Not Found", 404));
    }
    res.status(200).json({
      message: "Spare part deleted",
      sparePart,
    });
  })
);

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
