import express from "express";
import validateSparePart from "../middleware/validateSparePart.js";
import catchAsync from "../utils/catchAsync.js";

import authenticateToken from "../middleware/authMiddleware.js";
import * as spareParts from "../controllers/spare-part.js";

const router = express.Router();

router.use(authenticateToken);

router.route("/").get(catchAsync(spareParts.renderAllSpareParts)).post(validateSparePart, catchAsync(spareParts.createSpareParts));

router
  .route("/:id")
  .get(catchAsync(spareParts.showSparePart))
  .put(validateSparePart, catchAsync(spareParts.editSparePart))
  .delete(catchAsync(spareParts.deleteSparePart));

router.route("/:id/edit").get(catchAsync(spareParts.showEditSparePart));

export default router;
