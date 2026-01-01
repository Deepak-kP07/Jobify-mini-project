import { Router } from "express";
const router = Router();
import { register, login, logout } from "../Controllers/authControllers.js";
import validateRegisterInput from "../Errors/validateMiddleware.js";

router.post("/register", validateRegisterInput, register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
