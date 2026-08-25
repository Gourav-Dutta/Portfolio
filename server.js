import express from "express"

const app= express();

app.listen(8000, ()=>{console.log("Server is running")})


app.get('/', (req, res)=>{
    return res.send("Serever is running")
})