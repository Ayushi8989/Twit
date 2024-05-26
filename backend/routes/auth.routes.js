import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { checkAuth, signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/checkAuth", protectRoute, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;