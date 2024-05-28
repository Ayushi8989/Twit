import express from "express";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectMongoDB from "./db/connectMongoDB.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middleware to parse incoming requests in json format
app.use(express.json());
//middleware to parse incoming requests which are urlencoded(from HTML-forms)  
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use("/api/auth", authRoutes);//middleware for handling multiple http methods for a specific route
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    connectMongoDB();
})