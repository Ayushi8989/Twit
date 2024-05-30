import post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 } from "cloudinary";

export const createPost = async (req, res) => {
    const { text, image } = req.body;
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!text && !image) {
            return res.status(404).json({ error: "POst must have text or image" });
        }
        if (image) {
            const uploaded = await v2.UploadStream.upload(img);
            image = uploaded.secure_url;
        }
        const newPost = new post({
            user: userId,
            text: text,
            image: image
        })

        newPost.save();

        res.status(201).json({ newPost });
    } catch (error) {
        console.log("Error in createPOst controller: ", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const likeUnlikePost = async (req, res) => {
    const { id } = req.params;
    try {
        const givenUserPost = await post.findById(id);
        const userId = req.user._id;

        if (!givenUserPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        const isLiked = await givenUserPost.likes.includes(userId);
        if (isLiked) {
            await post.findByIdAndUpdate(id, { $pull: { likes: userId } })
            res.status(200).json({ message: "Post unliked successfully" });
        } else {
            await post.findByIdAndUpdate(id, { $push: { likes: userId } })
            res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const givenUserPost = await post.findById(id);
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!givenUserPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = { user: userId, text: text };

        givenUserPost.comments.push(comment);
        await givenUserPost.save();

        res.status(201).json(givenUserPost);

    } catch (error) {
        console.log("Error in commentPost controller: ", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.params;
    const user = req.user._id;

    try {
        const givenUserPost = await post.findById(id);

        if (!givenUserPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (givenUserPost.user.toString() !== user.toString()) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (givenUserPost.img) {
            const imgId = givenUserPost.img.split("/").pop().split(".")[0];
            await v2.uploader.destroy(imgId);
        }

        await post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the post" });
    }
};

export const allPosts = async (req, res) => {
    try {
        const posts = await post.find().sort({ createdAt: -1 }).populate({ path: "user", select: "-password" }).populate({ path: "comments.user", select: "-password" });
        if (posts.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in allPosts controller: ", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};