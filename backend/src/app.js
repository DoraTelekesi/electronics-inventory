import express from "express";
import mongoose from "mongoose";
import SparePart from "./models/spare-part.js";

const app = express();

//depends what type of body parsing I want, for regular form -->
app.use(express.urlencoded({ extended: true }));
//for json - raw data -->
// app.use(express.json())

main().catch((err) => console.log("Error", err));
async function main() {
  console.log("Connecting...");
  await mongoose.connect("mongodb://localhost:27017/inventory-app");
  console.log("Connection open");
}

app.get("/spare-part-list", async (req, res) => {
  const spareParts = await SparePart.find({});
  console.log(spareParts);
  res.send({ spareParts });
});

app.get("/spare-part-list/:id", async (req, res) => {
  const { id } = req.params;
  const sparePart = await SparePart.findById(id);
  console.log(sparePart);
  res.send(`this is the sparepart ${sparePart.model}, ${sparePart.type}`);
});

app.get("/spare-part-list/:id/edit", async (req, res) => {
  const { id } = req.params;
  const sparePart = await SparePart.findById(id);
  console.log(sparePart);
  res.send(`We are about to EDIT ${sparePart.model}, ${sparePart.type}`);
});

app.put("/spare-part-list/:id", async (req, res) => {
  const { id } = req.params;
  const sparePart = await SparePart.findByIdAndUpdate(id, req.body, { new: true });
  res.send(`Spare Part ${sparePart.model}, ${sparePart.type} Updated : ${sparePart}`);
});

app.post("/spare-part-list", async (req, res) => {
  const newSparePart = new SparePart(req.body);
  await newSparePart.save();
  console.log(newSparePart);
  res.send("New item added");
});

app.delete("/spare-part-list/:id", async (req, res) => {
  const { id } = req.params;
  const sparePart = await SparePart.findByIdAndDelete(id);
  res.send(`An item ${sparePart.manufacturer}, ${sparePart.model} deleted!`);
});

app.use((req, res) => {
  console.log("NEW REQUEST for unknown");
  res.send("THIS IS RESPONSE to catch all");
});

app.listen(3000, () => {
  console.log("listening on DORUS port 3000");
});
