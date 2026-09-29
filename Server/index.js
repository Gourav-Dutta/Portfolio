import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRoute } from "./src/routes/auth.route.js";
import { testRoute } from "./src/routes/testDatabase.route.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());


app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);

app.get("/", (req, res)=> {
  res.send("Hello from khanakhoj server");
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});