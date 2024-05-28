import notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username: username }).select("-password");
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ "error": "User not found" });
        }
    } catch (error) {
        console.log("Error in getUserProfile controller: ", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const followUnfollowUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const givenId = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ "error": "User cannot follow himself/herself" });
        }
        if (!givenId || !currentUser) {
            return res.status(400).json({ "error": "User not found" });
        }

        const isFollowing = await currentUser.following.includes(id);

        if (isFollowing) {
            //unfollow the givenId
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            res.status(200).json({ "message": "User unfollowed successfully" });
        } else {
            //follow the givenId
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

            const notif = new notification({
                from: req.user._id,
                to: id,
                type: "follow"
            })
            await notif.save();

            res.status(200).json({ "message": "User followed successfully" });
        }

    } catch (error) {
        console.log("Error in followUnfollowUsers controller: ", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const currentUser = req.user._id;
        const UsersFollowedByCurUser = await User.findById(currentUser).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: currentUser }
                },
            },
            { $sample: { size: 10 } }
        ]);

        const filtered = users.filter((user) => !UsersFollowedByCurUser.following.includes(user._id));
        const suggestedUsers = filtered.slice(0, 3);

        suggestedUsers.forEach((user) => (user.password = null));
        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log("Error in followUnfollowUsers controller: ", error.message);
        res.status(500).json({ error: "Internal server error." });
    };
};

export const updateProfile = async (req, res) => {
    const { fullName, username, email, currentPassword, newPassword, profileImg, coverImg } = req.body;
    try {
        const userId = req.user._id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Both current and new password must be provided" });
        }

        if (currentPassword && newPassword) {
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: "Current password is invalid" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        user.fullName = fullName || user.fullName;
        user.username = username || user.username;
        user.email = email || user.email;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        await user.save();

        // Remove password before sending the response
        user.password = undefined;

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateProfile controller: ", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};
