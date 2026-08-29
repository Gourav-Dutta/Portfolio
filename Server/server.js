import express from "express"
import { testRouter } from "./Routes/testDatabase.js";

const app= express();

app.listen(8000, ()=>{console.log("Server is running")})


app.get('/', (req, res)=>{
    return res.send("Serever is running")
})


app.use("/api", testRouter);