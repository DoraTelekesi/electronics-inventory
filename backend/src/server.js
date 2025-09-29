import mongoose from "mongoose";
import app from "./app.js";

main().catch((err) => console.log("Error", err));
async function main() {
  console.log("Connecting...");
  await mongoose.connect("mongodb://localhost:27017/inventory-app");
  console.log("Connection open");
}

app.listen(3000, () => {
  console.log("listening on DORUS port 3000");
});
