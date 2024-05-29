import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    text: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            text: {
                type: String,
                require: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                require: true
            }
        }
    ]

}, { timestamps: true });


const post = mongoose.model("post", postSchema);

export default post;