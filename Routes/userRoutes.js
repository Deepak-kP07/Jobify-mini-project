import { Router } from "express";
import multerMiddleware from "../middlewares/multerMiddleware.js";
// import { checkTestUser } from "../middlewares/authMiddleware.js";
const router = Router();
import {
  getAllUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
  getApplicationStats,
} from "../Controllers/userController.js";
import { authorizePermissions, checkTestUser } from "../middlewares/authMiddleware.js";
// createUser ,
// router.route('/').get(getAllUsers) //.post(createUser)
// router.route('/:id').get(getCurrentUser).patch(updateUser).delete(deleteUser)
router.get("/current-user", getCurrentUser);
router.patch("/update-user", multerMiddleware.single("avatar"),checkTestUser, updateUser);
router.delete("/delete-user", checkTestUser,deleteUser);
// admin routes
router.get("/admin/users", [authorizePermissions("admin"), getAllUsers]);
router.get("/admin/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
]);

export default router;
