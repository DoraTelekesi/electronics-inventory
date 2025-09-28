import mongoose from "mongoose";
import SparePart from "../models/spare-part.js";
import { manufacturers, depots, remarks, types, model } from "./seedHelper.js";

main().catch((err) => console.log("Error", err));
async function main() {
  console.log("Connecting...");
  await mongoose.connect("mongodb://localhost:27017/inventory-app");
  console.log("Connection open");
}

const seedDB = async () => {
  await SparePart.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const randomManu = Math.floor(Math.random() * manufacturers.length);
    const randomDep = Math.floor(Math.random() * depots.length);
    const randomTyp = Math.floor(Math.random() * remarks.length);
    const randomMod = Math.floor(Math.random() * types.length);
    // const randomRem = Math.floor(Math.random() * model.length);
    const sparePart = new SparePart({
      manufacturer: manufacturers[randomManu],
      model: model[randomMod],
      type: model[randomTyp],
      depot: model[randomDep],
      amount: Math.floor(Math.random() * 15),
      remarks: remarks,
    });
    await sparePart.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
