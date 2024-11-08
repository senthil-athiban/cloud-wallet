import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.json({status: 401, message: "Un authorized"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();    
    } catch (error) {
        console.log("Error in verifying the jwt token", error);
        return res.json({status: 500, message: "Internal Server Error"})
    }
}