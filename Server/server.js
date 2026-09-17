import express from "express"

import dotenv from "dotenv"

import escape from 'escape-html'
import {testRouter} from './Routes/testDatabase.js'
const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));

// app.use(
//   auth({
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.SECRET,
//     baseURL: process.env.BASE_URL,
//     clientID: process.env.CLIENT_ID,
//     issuerBaseURL: process.env.ISSUER_BASE_URL,
//     afterCallback: async (req, res, session) => {
//   try {


//   console.log("========== AUTH0 CALLBACK ==========");

//     const claims = decodeJwt(session.id_token);

//     console.log("Auth0 claims:", claims);

//     const auth0Id = claims.sub;
//     const email = claims.email;

//     console.log("Auth0 ID:", auth0Id);
//     console.log("Email:", email);

//     if (!auth0Id || !email) {
//       console.log("Missing Auth0 ID or email");
//       return session;
//     }

//     const user = await db.orm.public.User.upsert({
//       where: {
//         auth0Id: auth0Id,
//       },

//       update: {},

//       create: {
//         auth0Id: auth0Id,
//         email: email,
//         name: null,
//         phone: null,
//         profileComplete: false,
//       },
//     });

//     console.log("Database user:", user);
//     console.log("========== USER CREATED/FOUND ==========");

//     return session;

//     // console.log(req );
// //    const auth0Id = req.oidc.user?.sub;
// // const email = req.oidc.user?.email;
// // const name = req.oidc.user?.name;

// //     console.log("========== AUTH0 CALLBACK ==========");
// //     console.log("Auth0 ID:", auth0Id);
// //     console.log("Email:", email);
// //     // console.log("Name:", name);

// //     if (!auth0Id || !email) {
// //       console.log("Missing Auth0 ID or email");
// //       return session;
// //     }

// //     const user = await db.orm.public.User.upsert({
// //       where: {
// //         auth0Id: auth0Id,
// //       },

// //       update: {},

// //       create: {
// //         auth0Id: auth0Id,
// //         email: email,
// //         name: name ?? null,
// //         profileComplete: false,
// //       },
// //     });

// //     console.log("Database user:", user);
// //     console.log("========== USER CREATED/FOUND ==========");

// //     return session;

//   } catch (error) {
//     console.error("========== AUTH0 DATABASE ERROR ==========");
//     console.error(error);

//     throw error;
//   }
// },
//   })
// );


// app.use(async (req, res, next) => {
//   if (!req.oidc.isAuthenticated()) return next();
// if (
//   req.path === "/complete-profile" ||
//   req.path === "/api/complete-profile" ||
//   req.path === "/logout"
// ) {
//   return next();
// }

//   const user = await db.orm.public.User
//   .where({
//   auth0Id: req.oidc.user.sub
//   })
//   .first();

//   if (user && !user.profileComplete) {
//     return res.redirect("/complete-profile");
//   }
//   next();
// });

// app.get('/signup', (req, res) =>
//   res.oidc.login({
//     returnTo: '/',
//     authorizationParams: { screen_hint: 'signup' },
//   })
// );

// app.get('/', (req, res) => {
//   if (!req.oidc.isAuthenticated()) {
//     return res.type('html').send(`
//       <a href="/signup">Signup</a><br>
//       <a href="/login">Log in</a>
//     `);
//   }
//   res.type('html').send(`
//     <p>Logged in as ${escape(req.oidc.user.name)}</p>
//     <h1>User Profile</h1>
//     <pre>${escape(JSON.stringify(req.oidc.user, null, 2))}</pre>
//     <a href="/logout">Log out</a>
//   `);
// });

// app.get("/complete-profile", (req, res) => {
//   if (!req.oidc.isAuthenticated()) return res.redirect("/login");
//   res.type("html").send(`
//     <form method="POST" action="/api/complete-profile">
//       <input name="phone" placeholder="Phone" />
//       <input name="name" placeholder="Name" />
//       <button type="submit">Save</button>
//     </form>
//   `);
// });

app.use("/api", testRouter);

app.listen(8000, () => console.log("Server is running"));