import dotenv from "dotenv";
dotenv.config();
import { readFile } from "fs/promises";
import mongoose from "mongoose";

import Jobs from "./Models/jobModel.js";
import Users from "./Models/userModel.js";

try {
  await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
  const user = await Users.findOne({ email: "demo@gmail.com" });
  const jsonJobs = JSON.parse(
    await readFile(new URL("./utils/MOCK_DATA.json", import.meta.url))
  );
  const jobs = jsonJobs.map((job) => {
    return { ...job, createdBy: user._id };
  });
  await Jobs.deleteMany({ createdBy: user._id });
  await Jobs.create(jobs);
  console.log("Data Populated");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
