import mongoose from "mongoose";
import app from "./app.js";

const PORT = 3000;
const DB_NAME = "sparepartsDB";

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected inside container");
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
})
.catch(err => console.error("MongoDB connection error:", err));
