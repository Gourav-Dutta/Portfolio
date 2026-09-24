import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/auth/auth.js";


const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.get("/", (req, res)=> {
  res.send("Hello from khanakhoj server");
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});