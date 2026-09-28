import {prisma} from "../utils/db.js";
import {z} from "zod";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../service/auth.js";

const userSignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 characters long"),
})


async function handleSignUp(req, res){
    try{
        const body = userSignUpSchema.parse(req.body);
        console.log("Parsed request body:", body);
        const existingUser= await prisma.user.findFirst({
            where: {
                OR: [
                    {email: body.email},
                    {name: body.name}
                ]
            }
        });

        if(existingUser){
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
    }catch(error){
        if(error instanceof z.ZodError){
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

async function handleLogin(req, res){
    try{

        const body = userLoginSchema.parse(req.body);

        const userExisting = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if(!userExisting){
            return res.status(400).json({
                message: "User not found"
            })
        };

        const verifyPassword = await bcrypt.compare(body.password, userExisting.password);

        if(!verifyPassword){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        };

        const token = generateToken(userExisting);
        const {password, ...userWithoutPassword} = userExisting;
        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: userWithoutPassword
        });



    }catch(error){
    if (error instanceof z.ZodError){
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


export {
    handleSignUp as handleSignUpFunction,
    handleLogin as handleLoginFunction
}