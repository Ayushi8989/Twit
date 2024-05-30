import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost, likeUnlikePost, commentPost, deletePost, allPosts } from "../controllers/post.controller.js";
const router = express.Router();

router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentPost);
router.delete("/:id", protectRoute, deletePost);
router.get("/posts", protectRoute, allPosts);

export default router;