import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// `npm run dev` runs from `backend/`, so the default only loads `backend/.env`.
// Your keys live in `backend/src/.env` — load that (and optional `backend/.env`).
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || "sparepartsDB";
const mongoURI = process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${DB_NAME}`;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected inside container", mongoURI);
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("connected", () => {
  console.log("Mongo connection host:", mongoose.connection.host);
});

mongoose.connection.on("error", (err) => {
  console.error("Mongo connection error:", err);
});
