import { prisma } from "../utils/db.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefershToken, verifyToken } from "../service/auth.js";

const userSignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 characters long"),
})


async function handleSignUp(req, res) {
    try {
        const body = userSignUpSchema.parse(req.body);
        console.log("Parsed request body:", body);
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: body.email },
                    { name: body.name }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User name or email already exists"
            })
        };


        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
                phone_no: body.phone,
            }
        })

        return res.status(201).
            json({
                message: "User created successfully please Login",
                user: user
            })
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log("Validation error:", error.errors);
            return res.status(400).json({
                message: "Invalid request data",
                errors: error.errors
            })
        }
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}



const userLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

async function handleLogin(req, res) {
    try {

        const body = userLoginSchema.parse(req.body);

        const userExisting = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (!userExisting) {
            return res.status(400).json({
                message: "User not found"
            })
        };

        const verifyPassword = await bcrypt.compare(body.password, userExisting.password);

        if (!verifyPassword) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        };
        const refreshToken = generateRefershToken(userExisting);
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10)
        const session = await prisma.session.create({
            data: {
                user_id: userExisting.id,
                refresh_token: refreshTokenHash,
                ip_address: req.ip,
                user_agent: req.headers['user-agent'] || 'unknown',
                revoked: false,
            }
        });
        const accessToken = generateAccessToken(userExisting, session.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        const { password, ...userWithoutPassword } = userExisting;
        return res.status(200).json({
            message: "Login successful",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userWithoutPassword,
            session
        });



    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log("Validation error:", error.errors);
            return res.status(400).json({
                message: "Invalid request data",
                errors: error.errors
            });
        }
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


async function handleRefreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            })
        }
        const decode = verifyToken(refreshToken);
        console.log("Decoded refresh token:", decode);
        const userExisting = await prisma.user.findUnique({
            where: {
                id: decode.id
            }
        });

        if (!userExisting) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const sessions = await prisma.session.findMany({
            where: {
                revoked: false
            }
        });

        let matchedSession = null;
        for (const session of sessions) {
            const isMatched = await bcrypt.compare(refreshToken, session.refresh_token);

            if (isMatched) {
                matchedSession = session;
                break;
            }
        };

        if (!matchedSession) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        console.log("Matched session:", matchedSession.refresh_token);
        const accessToken = generateAccessToken(userExisting);
        const newRefreshToken = generateRefershToken(userExisting);
        const updatedSession = await prisma.session.update({
            where: {
                id: matchedSession.id
            },
            data: {
                refresh_token: await bcrypt.hash(newRefreshToken, 10)
            }
        });
        console.log("Updated session:", updatedSession.refresh_token);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.status(200).json({
            message: "Refresh token is valid",
            user: decode,
            accessToken: accessToken,
            oldsession: matchedSession,
            session: updatedSession
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


async function handleLogout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            })
        };

        const sessions = await prisma.session.findMany({
            where: {
                revoked: false
            }
        });
        let matchSession = null;
        for (const session of sessions) {
            const isMatch = await bcrypt.compare(refreshToken, session.refresh_token)

            if (isMatch) {
                matchSession = session;
                break;
            }
        }


        if (!matchSession) {
            return res.status(404).json({
                message: "Session not found"
            })
        };

        await prisma.session.update({
            where: {
                id: matchSession.id
            },
            data: {
                revoked: true
            }
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });

        return res.status(200).json({
            message: "Logged out successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export {
    handleSignUp as handleSignUpFunction,
    handleLogin as handleLoginFunction,
    handleRefreshToken as handleRefreshTokenFunction,
    handleLogout as handleLogoutFunction
}