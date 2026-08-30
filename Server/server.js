import express from "express"
import { testRouter } from "./Routes/testDatabase.js";
// import { configDotenv } from "dotenv";
// const { auth } = require('express-openid-connect');
// const escape = require('escape-html');
import dotenv from "dotenv"
import {auth} from 'express-openid-connect'
import escape from 'escape-html'

const app= express();
dotenv.config();
app.listen(8000, ()=>{console.log("Server is running")})

app.use(
  auth({
    authRequired: false, // set to true to require authentication for all routes
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
  })
);
app.get('/signup', (req, res) =>
  res.oidc.login({
    returnTo: '/',
    authorizationParams: { screen_hint: 'signup' },
  })
);

app.get('/', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.type('html').send(`
      <a href="/signup">Signup</a><br>
      <a href="/login">Log in</a>
    `);
  }

  res.type('html').send(`
    <p>Logged in as ${escape(req.oidc.user.name)}</p>
    <h1>User Profile</h1>
    <pre>${escape(JSON.stringify(req.oidc.user, null, 2))}</pre>
    <a href="/logout">Log out</a>
  `);
});
app.get('/', (req, res)=>{
    return res.send("Serever is running")
})


app.use("/api", testRouter);