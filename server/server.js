import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./configs/db.js";
import "dotenv/config";
import router from "./routes/indexRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";

import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();
await connectCloudinary();

// "https://shopease-frontend-9sps.onrender.com"

const allowedOrigin = ["https://shopease-frontend-9sps.onrender.com"];

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: allowedOrigin, credentials: true }));

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
