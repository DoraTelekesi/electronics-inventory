import {sparePartSchema} from "../schemas.js";
import ExpressError from "../utils/ExpressError.js";

const validateSparePart = (req, res, next) => {
  const { error } = sparePartSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

export default validateSparePart;
