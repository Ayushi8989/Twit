import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, followUnfollowUsers, getSuggestedUsers, updateProfile} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUsers);
router.post("/update", protectRoute, updateProfile);

export default router;