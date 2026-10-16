
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

// Generate Access Token
function generateAccessToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        process.env.JWT_SECREAT_KEY,
        {
            expiresIn: "15m",
        }
    );
}


// Refresh Token
function generateRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}

function hashRefreshToken(refreshToken) {
    return crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
}

// Verify Access Token
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECREAT_KEY);
    } catch {
        return null;
    }
}

export {
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    verifyToken,
};
