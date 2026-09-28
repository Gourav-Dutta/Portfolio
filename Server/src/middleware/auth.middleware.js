import { verifyToken } from "../service/auth.js";


function authMiddleware(req, res, next){
    try{
        console.log("Request: " , req.headers);
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message: "Authorization header missing or invalid"
            })
        };

        const token = authHeader.split("Bearer ")[1];
        const user = verifyToken(token);
        if(!user){
            return res.status(401).json({
                message: "Invalid token"
            })
        };
        req.user = user;
        console.log("User from token:", user);
        console.log("Authorization header:", authHeader);
        next();
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
}
}



export {
    authMiddleware
}