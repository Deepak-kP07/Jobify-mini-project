import { hashedPassword, comparePassword } from "../utils/passwordUtils.js";
import { token } from "../utils/jwtToken.js";
import User from "../Models/userModel.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  UnauthenticatedError,
} from "../Errors/customError.js";
// import { Collection } from "mongoose"

//register controller
export const register = async (req, res, next) => {
  const firstUser = (await User.countDocuments()) === 0;
  req.body.role = firstUser ? "admin" : "user";
  // pass hashing
  const hashedPass = await hashedPassword(req.body.password);
  req.body.password = hashedPass;

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "User was created", user });
};

//login controller
export const login = async (req, res, next) => {
  // Trim email and password to handle whitespace issues
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  // here we are creating a jwt token and assigning it to the res.cookie object
  const mytoken = token({ userId: user._id, role: user.role });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("mytokenCookie", mytoken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res
    .status(StatusCodes.OK)
    .json({ message: "user logged in", user, token: mytoken });
};

//logout controller
export const logout = async (req, res, next) => {
  res.cookie(
    // 'mytokenCookie' = The name of the cookie (same as login)
    // Value Replacement: JWT token is replaced with "logout" string
    "mytokenCookie",
    "logout",
    {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: process.env.NODE_ENV === "production",
    }
  );
  res.status(StatusCodes.OK).json({ message: "user logged out" });
};
 