import SparePart from "../models/spare-part.js";
import ExpressError from "../utils/ExpressError.js";

export const renderAllSpareParts = async (req, res, next) => {
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
};

export const createSpareParts = async (req, res, next) => {
  const { manufacturer, model, type, depot, amount, remarks } = req.body;
  const newSparePart = new SparePart({ manufacturer, model, type, depot, amount, remarks });
  await newSparePart.save();
  console.log(newSparePart);
  res.status(201).json({
    message: "New item added",
    sparePart: newSparePart,
  });
};

export const showSparePart = async (req, res, next) => {
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
};

export const editSparePart = async (req, res, next) => {
  const { id } = req.params;
  const { manufacturer, model, type, depot, amount, remarks } = req.body;
  const sparePart = await SparePart.findByIdAndUpdate(id, { manufacturer, model, type, depot, amount, remarks }, { new: true, runValidators: true });
  if (!sparePart) {
    return next(new ExpressError("Spare Part Not Found", 404));
  }
  res.status(200).json({
    message: `Spare Part ${sparePart.model}, ${sparePart.type} updated`,
    sparePart,
  });
};

export const showEditSparePart = async (req, res, next) => {
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
};

export const deleteSparePart = async (req, res, next) => {
  const { id } = req.params;
  const sparePart = await SparePart.findByIdAndDelete(id);
  if (!sparePart) {
    return next(new ExpressError("Spare Part Not Found", 404));
  }
  res.status(200).json({
    message: "Spare part deleted",
    sparePart,
  });
};
