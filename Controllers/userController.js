import User from "../Models/userModel.js";
import Jobs from "../Models/jobModel.js";
import { StatusCodes } from "http-status-codes";
import { customAPIError } from "../Errors/customError.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

//create user - this is register user we do in auth router
// export const createUser = async (req,res,next) =>{
//     try {
//         const user = await User.create(req.body)
//         res.status(StatusCodes.CREATED).json({user})
//     } catch (error) {
//         // throw new customAPIError(error.message)
//         res.status(500).json({message: error.message})
//     }
// }

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    // throw new customAPIError(error.message)
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    // Use the authenticated user's ID from req.user (set by authenticateUser middleware)
    const user = await User.findById(req.user.userId);
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    // throw new customAPIError(error.message)
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Update current authenticated user only (not by ID from params)
    const newUser = { ...req.body };
    delete newUser.password;

    if (req.file) {
      console.log("Uploading file to Cloudinary:", req.file.path);
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      console.log("Cloudinary upload success:", response.public_id);
      await fs.unlink(req.file.path);
      console.log("Local file deleted");
      newUser.avatar = response.secure_url;
      newUser.avatar_public_id = response.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

    if (req.file && updatedUser.avatar_public_id) {
      await cloudinary.v2.uploader.destroy(updatedUser.avatar_public_id);
    }

    // Return the updated user data (merge old user with new changes) or fetch again.
    // Fetching again is safer to ensure we send exactly what's in the DB.
    const user = await User.findById(req.user.userId);

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    // throw new customAPIError(error.message)
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    // Delete current authenticated user only (not by ID from params)
    const user = await User.findByIdAndDelete(req.user.userId);
    res.status(StatusCodes.OK).json({ user, message: "user deleted" });
  } catch (error) {
    // throw new customAPIError(error.message)
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationStats = async (req, res, next) => {
  try {
    // const stats = await User.aggregate([
    //   { $group: { _id: null, totalUsers: { $sum: 1 } } },
    // ]);
    const users = await User.countDocuments();
    const jobs = await Jobs.countDocuments();
    res.status(StatusCodes.OK).json({ users, jobs });
  } catch (error) {
    // throw new customAPIError(error.message)
    res.status(500).json({ message: error.message });
  }
};
