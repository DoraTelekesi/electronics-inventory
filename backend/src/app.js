import express from "express";
import mongoose from "mongoose";

const app = express();

main().catch((err) => console.log("Error", err));
async function main() {
  console.log("Connecting...");
  await mongoose.connect("mongodb://localhost:27017/inventory-app");
  console.log("Connection open");
}

app.get("/", (req, res) => {
  res.send("THIS IS RESPONSE");
});

app.use((req, res) => {
  console.log("NEW REQUEST for unknown");
  res.send("THIS IS RESPONSE to catch all");
});

app.listen(3000, () => {
  console.log("listening on DORUS port 3000");
});
