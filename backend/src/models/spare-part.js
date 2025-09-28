import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SparePartSchema = new Schema({
  manufacturer: String,
  model: String,
  type: String,
  depot: String,
  amount: Number,
  remarks: [
    {
      type: String,
    },
  ],
});

const SparePart = mongoose.model("SparePart", SparePartSchema);
export default SparePart;