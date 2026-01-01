import { UnauthorizedError, BadRequestError } from "../Errors/customError.js";
import { verifyToken } from "../utils/jwtToken.js";

export const authenticateUser = (req, res, next) => {
  // console.log('auth middleware')
  const token = req.cookies.mytokenCookie;
  if (!token) {
    throw new UnauthorizedError("Authentication invalid");
  }
  try {
    // here we are destructuring the userId & role from jwt token and assigning it to the req.user object
    const { userId, role } = verifyToken(token);
    const testUser = userId === "6943f0f5c87221ada09ed74f";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthorizedError("Authentication invalid");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    next();
  };
};

export const checkTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Demo user cannot perform this action");
  }
  next();
};
