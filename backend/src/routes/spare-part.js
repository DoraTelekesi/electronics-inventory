import express from "express";
import SparePart from "../models/spare-part.js";
import validateSparePart from "../middleware.js";
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";

const router = express.Router();

router
  .route("/")
  .get(
    catchAsync(async (req, res, next) => {
      const spareParts = await SparePart.find({});
      if (spareParts.length === 0) {
        console.log(spareParts);
        return next(new ExpressError("No Spare Parts in the List", 404));
      }
      console.log(spareParts);
      res.status(200).json({
        message: "Spare parts retrieved",
        spareParts,
      });
      // const raw = await req.app.get("db").collection("spareparts").find({}).toArray();
      // console.log("Raw query:", raw);
      // console.log("Query result:", spareParts);
    })
  )
  .post(
    validateSparePart,
    catchAsync(async (req, res, next) => {
      const { manufacturer, model, type, depot, amount, remarks } = req.body;
      const newSparePart = new SparePart({ manufacturer, model, type, depot, amount, remarks });
      await newSparePart.save();
      console.log(newSparePart);
      res.status(201).json({
        message: "New item added",
        sparePart: newSparePart,
      });
    })
  );

router
  .route("/:id")
  .get(
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
  )
  .put(
    validateSparePart,
    catchAsync(async (req, res, next) => {
      const { id } = req.params;
      const { manufacturer, model, type, depot, amount, remarks } = req.body;
      const sparePart = await SparePart.findByIdAndUpdate(
        id,
        { manufacturer, model, type, depot, amount, remarks },
        { new: true, runValidators: true }
      );
      if (!sparePart) {
        return next(new ExpressError("Spare Part Not Found", 404));
      }
      res.status(200).json({
        message: `Spare Part ${sparePart.model}, ${sparePart.type} updated`,
        sparePart,
      });
    })
  )
  .delete(
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

router.route("/:id/edit").get(
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

export default router;
