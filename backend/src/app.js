import express from "express";
import mongoose from "mongoose";

const app = express();

main().catch((err) => console.log("Error", err));
async function main() {
  console.log("Connecting...");
  await mongoose.connect("mongodb://localhost:27017/inventory-app");
  console.log("Connection open");
}

app.get("/d/:name", (req, res) => {
  const { name } = req.params;
  res.send(`THIS IS RESPONSE FROM ${name}`);
});

app.use((req, res) => {
  console.log("NEW REQUEST for unknown");
  res.send("THIS IS RESPONSE to catch all");
});

app.listen(3000, () => {
  console.log("listening on DORUS port 3000");
});
