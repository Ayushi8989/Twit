import jwt from "jsonwebtoken";

export const generateTokenandsetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,//miliseconds
        httpOnly: true, //to prevent xxs sttacks cross-site scripting attacks
        sameSit: "strict", //CSRF attack cross site req frogery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};