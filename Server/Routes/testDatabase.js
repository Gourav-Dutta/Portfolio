// import { Router } from "express";
// import { test, getUsers } from "../Controller/user.controller.js";
// // import { db } from "../src/prisma/db.ts";

// const router = Router();

// router.post("/test", test);

// router.get("/getUser", getUsers);

// router.post("/complete-profile", async (req, res) => {
//   try {
//     console.log("Complete profile request body:", req.body);
//     if (!req.oidc.isAuthenticated()) {
//       return res.sendStatus(401);
//     }

//     const auth0Id = req.oidc.user.sub;
//     console.log("Auth0 ID:", auth0Id);

//     const user = await db.orm.public.User
//   .where({
//     auth0Id: auth0Id,
//   })
//   .update({
//     phone: req.body.phone,
//     name: req.body.name,
//     profileComplete: true,
//   });

// console.log("Updated user:", user);

//     res.redirect("/");
//   } catch (error) {
//     console.error("Complete profile error:", error);
//     res.status(500).send("Something went wrong");
//   }
// });

// export { router as testRouter };