// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";

// import { prisma } from "../utils/db.js";

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),

//   emailAndPassword: {
//     enabled: true,
//   },

//   trustedOrigins: [
//     "http://localhost:3000",
//   ],
// });


import jwt from "jsonwebtoken";

function generateToken(user){
  return jwt.sign({
    id: user.id,
    email: user.email,
    name: user.name
  }, process.env.JWT_SECREAT_KEY, {expiresIn: "7d"})
}

function verifyToken(token){
   try{
     return jwt.verify(token, process.env.JWT_SECREAT_KEY)
  }catch(error){
    console.log("Token verification error:", error);
    return null;
  }
}


export {
  generateToken,
  verifyToken
}
