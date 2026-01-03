import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import cloudinary from "cloudinary";

import { nanoid } from "nanoid";
// controllers and routes
import jobRoutes from "./Routes/jobRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//public

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// const jobs = [
//   {id :nanoid(10) , company : 'apple' , position: 'front-end developer'},
//   {id :nanoid(10) , company : 'google' , position: 'back-end developer'},
// ]

//middlewares
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
import { authenticateUser } from "./middlewares/authMiddleware.js";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json()); // now my app can handle JSON requests!
app.use(cookieParser());

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // More detailed logging
  // app.use(morgan('dev')) // Simpler format
}

// Serve static files from public folder (avatars, uploads, etc.)
// These should be accessible without authentication
app.use(express.static(path.resolve(__dirname, "./public")));

// In production, also serve frontend build files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "./front-end/dist")));
}

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

app.use("/api/v1/jobs", authenticateUser, jobRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", authenticateUser, userRoutes);

// Error handling middleware should be at the end (before catch-all)
app.use(errorHandlingMiddleware);

// Catch-all route: serve frontend for any non-API routes (only in production)
// In development, Vite dev server handles routing
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.resolve(__dirname, "./front-end/dist/index.html"));
    } else {
      next();
    }
  });
}

try {
  const port = process.env.PORT || 5200;
  await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`server is walking on the PORT ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
