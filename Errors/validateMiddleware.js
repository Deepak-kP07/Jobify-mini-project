import pkg from "express-validator";
const { body, validationResult } = pkg;

const validateRegisterInput = [
  body("firstName")
    .notEmpty()
    .withMessage("first name is required")
    .isLength({ min: 3 })
    .withMessage("first name must be at least 3 characters"),
  body("lastName").notEmpty().withMessage("last name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("location").notEmpty().withMessage("location is required"),

  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((err) => ({
          field: err.path || err.param || err.location,
          message: err.msg,
        })),
      });
    }
    next();
  },
];

export default validateRegisterInput;
