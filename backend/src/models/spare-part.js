import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SparePartSchema = new Schema({
  manufacturer: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  depot: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [1, "Amount must be grater than zero"],
  },
  remarks: [
    {
      type: String,
    },
  ],
});

const SparePart = mongoose.model("SparePart", SparePartSchema);
export default SparePart;
