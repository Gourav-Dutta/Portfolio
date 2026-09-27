import express from "express";
import morgan from "morgan";
import { authRoute } from "./src/routes/auth.route.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/auth", authRoute);

app.get("/", (req, res)=> {
  res.send("Hello from khanakhoj server");
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});