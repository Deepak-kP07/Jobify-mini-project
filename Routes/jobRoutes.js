import { Router } from "express";
const router = Router()
import { getAllJobs , createJob , getJob, editJob , deleteJob, showStats  } from "../Controllers/JobControllers.js";
import { checkTestUser } from "../middlewares/authMiddleware.js";


router.route('/').get(getAllJobs).post( checkTestUser ,createJob);
router.route('/stats').get(showStats)
router.route('/:id').get(getJob).patch( checkTestUser, editJob).delete( checkTestUser, deleteJob);
export default router